# -*- coding: utf-8 -*-
import json
import logging
from datetime import date
import odoo
from odoo import http, _
from odoo.http import request
from odoo.addons.web.controllers.utils import ensure_db

_logger = logging.getLogger(__name__)

ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:5173',
]


def _get_cors_headers():
    origin = request.httprequest.headers.get('Origin')
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
    }
    if origin in ALLOWED_ORIGINS:
        headers['Access-Control-Allow-Origin'] = origin
    elif not origin:
        headers['Access-Control-Allow-Origin'] = '*'
    else:
        headers['Access-Control-Allow-Origin'] = origin
    return headers


def json_response(payload, status=200):
    body = json.dumps({'status': 'success', 'data': payload}, default=str)
    return request.make_response(body, headers=_get_cors_headers(), status=status)


def error_response(message, status=400, error_code=None):
    body = json.dumps({
        'status': 'error',
        'message': message,
        'code': error_code or status
    })
    return request.make_response(body, headers=_get_cors_headers(), status=status)


class SehaApiController(http.Controller):

    # -------------------------------------------------------------------------
    # CORS Preflight
    # -------------------------------------------------------------------------
    @http.route('/api/v1/<path:subpath>', type='http', auth='none', methods=['OPTIONS'], csrf=False)
    def api_options(self, subpath, **kwargs):
        return request.make_response('', headers=_get_cors_headers(), status=204)

    # -------------------------------------------------------------------------
    # Helper: Resolve Active Role and Record
    # -------------------------------------------------------------------------
    def _resolve_user_context(self, user):
        """Identifies roles and attached records for the authenticated user."""
        env = request.env(user=user)
        is_admin = user.has_group('seha_sports_platform.group_seha_admin')
        is_medical = user.has_group('seha_sports_platform.group_seha_medical')

        # Check player link
        player = env['seha.player'].sudo().search([
            '|', ('user_id', '=', user.id), ('partner_id', '=', user.partner_id.id)
        ], limit=1)

        # Check parent link
        parent = env['seha.parent'].sudo().search([
            '|', ('user_id', '=', user.id), ('partner_id', '=', user.partner_id.id)
        ], limit=1)

        roles = []
        if is_admin:
            roles.append('super_admin')
        if is_medical:
            roles.append('medical_staff')
        if parent:
            roles.append('guardian')
        if player:
            roles.append('athlete')

        primary_role = roles[0] if roles else 'citizen'
        return {
            'user': user,
            'roles': roles,
            'primary_role': primary_role,
            'player': player,
            'parent': parent,
        }

    # -------------------------------------------------------------------------
    # Authentication & Account Context
    # -------------------------------------------------------------------------
    @http.route('/api/v1/auth/login', type='http', auth='none', methods=['POST'], csrf=False)
    def api_login(self, **kwargs):
        # 1. Parse JSON body or form
        data = {}
        raw_body = request.httprequest.get_data(as_text=True)
        if raw_body:
            try:
                data = json.loads(raw_body)
            except (ValueError, TypeError):
                data = {}
        if not data:
            data = dict(request.params) if request.params else {}
        if not data:
            data = kwargs

        login = (data.get('login') or data.get('identifier') or '').strip()
        password = (data.get('password') or '').strip()
        role_hint = data.get('role')

        if not login or not password:
            return error_response(_("Login identifier and password are required."), status=400, error_code='MISSING_CREDENTIALS')

        # Ensure database is selected
        if not request.db:
            request.session.db = 'sports_platform'
            ensure_db()
        request.update_env(user=odoo.SUPERUSER_ID, su=True)

        # If user passed a 14-digit National ID, resolve user from seha.player or seha.parent
        clean_nid = ''.join(c for c in str(login) if c.isdigit())
        actual_login = login
        player = None
        parent = None

        if len(clean_nid) == 14:
            # Query player and parent by national ID
            player = request.env['seha.player'].sudo().search([('national_id', '=', clean_nid)], limit=1)
            parent = request.env['seha.parent'].sudo().search([('national_id', '=', clean_nid)], limit=1)

            # Strict Backend Integrity Check: Must exist in database
            if not player and not parent:
                return error_response(
                    _("الرقم القومي غير مسجل في المنظومة. يرجى التأكد من صحة الرقم أو إنشاء حساب جديد."),
                    status=401,
                    error_code='NATIONAL_ID_NOT_FOUND'
                )

            target_user = None
            if role_hint == 'athlete' and player:
                target_user = player.user_id or request.env['res.users'].sudo().search([('partner_id', '=', player.partner_id.id)], limit=1)
            elif role_hint == 'guardian' and parent:
                target_user = parent.user_id or request.env['res.users'].sudo().search([('partner_id', '=', parent.partner_id.id)], limit=1)
            elif parent:
                target_user = parent.user_id or request.env['res.users'].sudo().search([('partner_id', '=', parent.partner_id.id)], limit=1)
            elif player:
                target_user = player.user_id or request.env['res.users'].sudo().search([('partner_id', '=', player.partner_id.id)], limit=1)

            if not target_user:
                return error_response(
                    _("لا يوجد حساب مستخدم مسجل مرتبط بهذا الرقم القومي."),
                    status=401,
                    error_code='NO_USER_FOR_NATIONAL_ID'
                )
            actual_login = target_user.login
        else:
            # Identifier is email or username
            if actual_login == 'admin@seha.gov.eg':
                actual_login = 'admin'
            target_user = request.env['res.users'].sudo().search([
                '|', ('login', '=ilike', actual_login), ('email', '=ilike', actual_login)
            ], limit=1)
            if not target_user:
                return error_response(
                    _("بيانات الدخول غير صحيحة. يرجى التحقق من صحة اسم المستخدم أو البريد."),
                    status=401,
                    error_code='USER_NOT_FOUND'
                )
            actual_login = target_user.login

        # Authenticate credentials via Odoo 19 Session.authenticate(env, credential)
        uid = None
        credential = {'type': 'password', 'login': actual_login, 'password': password}
        try:
            auth_info = request.session.authenticate(request.env, credential)
            uid = auth_info.get('uid') if isinstance(auth_info, dict) else auth_info
        except Exception as e:
            _logger.warning("Primary auth failed for %s: %s", actual_login, str(e))
            # Support well-known demo passwords if user typed parent2026 / guardian2026 or admin / admin2026
            alt_password = None
            if actual_login == 'guardian@seha.gov.eg' and password in ('parent2026', 'guardian2026'):
                alt_password = 'guardian2026' if password == 'parent2026' else 'parent2026'
            elif actual_login == 'admin' and password in ('admin', 'admin2026'):
                alt_password = 'admin' if password == 'admin2026' else 'admin2026'

            if alt_password:
                try:
                    auth_info = request.session.authenticate(request.env, {'type': 'password', 'login': actual_login, 'password': alt_password})
                    uid = auth_info.get('uid') if isinstance(auth_info, dict) else auth_info
                except Exception:
                    uid = None

        if not uid:
            return error_response(
                _("كلمة المرور غير صحيحة. يرجى التحقق من صحة كلمة المرور وإعادة المحاولة."),
                status=401,
                error_code='AUTH_FAILED'
            )

        user = request.env['res.users'].sudo().browse(uid)
        ctx = self._resolve_user_context(user)

        res_data = {
            'session_id': request.session.sid,
            'user_id': user.id,
            'name': user.name,
            'email': user.email or user.login,
            'national_id': clean_nid if len(clean_nid) == 14 else (ctx['player'].national_id if ctx['player'] else (ctx['parent'].national_id if ctx['parent'] else None)),
            'roles': ctx['roles'],
            'primary_role': ctx['primary_role'],
            'athlete': {
                'id': ctx['player'].id,
                'code': ctx['player'].code,
                'name': ctx['player'].name,
                'national_id': ctx['player'].national_id,
            } if ctx['player'] else None,
            'guardian': {
                'id': ctx['parent'].id,
                'code': ctx['parent'].code,
                'name': ctx['parent'].name,
                'national_id': ctx['parent'].national_id,
            } if ctx['parent'] else None,
        }
        return json_response(res_data)

    @http.route('/api/v1/auth/register', type='http', auth='none', methods=['POST'], csrf=False)
    def api_register(self, **kwargs):
        data = {}
        raw_body = request.httprequest.get_data(as_text=True)
        if raw_body:
            try:
                data = json.loads(raw_body)
            except (ValueError, TypeError):
                data = {}
        if not data:
            data = dict(request.params) if request.params else {}
        if not data:
            data = kwargs

        role = str(data.get('role', 'athlete')).strip().lower()
        if role in ('citizen', 'player'):
            role = 'athlete'
        elif role in ('parent',):
            role = 'guardian'

        name = (data.get('name') or data.get('fullName') or '').strip()
        national_id = ''.join(c for c in str(data.get('national_id') or data.get('nationalId') or '') if c.isdigit())
        password = str(data.get('password') or '').strip()
        phone = str(data.get('phone') or '').strip()
        email = str(data.get('email') or '').strip()

        if not name:
            return error_response(_("يرجى إدخال الاسم الرباعي بالكامل."), status=400, error_code='MISSING_NAME')

        if len(national_id) != 14:
            return error_response(_("الرقم القومي غير صحيح (مطلوب 14 رقمًا)."), status=400, error_code='INVALID_NATIONAL_ID')

        if len(password) < 6:
            return error_response(_("كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام."), status=400, error_code='INVALID_PASSWORD')

        if not request.db:
            request.session.db = 'sports_platform'
            ensure_db()
        request.update_env(user=odoo.SUPERUSER_ID, su=True)
        su_env = request.env

        # Check existing national ID
        existing_player = su_env['seha.player'].search([('national_id', '=', national_id)], limit=1)
        existing_parent = su_env['seha.parent'].search([('national_id', '=', national_id)], limit=1)
        if existing_player or existing_parent:
            return error_response(
                _("هذا الرقم القومي مسجل بالفعل في المنظومة. يرجى تسجيل الدخول مباشرة."),
                status=409,
                error_code='DUPLICATE_NATIONAL_ID'
            )

        # Generate login email
        user_login = email if email else f"{national_id}@seha.gov.eg"
        existing_user = su_env['res.users'].search([('login', '=', user_login)], limit=1)
        if existing_user:
            return error_response(
                _("البريد الإلكتروني أو اسم المستخدم مسجل بالفعل في المنظومة."),
                status=409,
                error_code='DUPLICATE_USER'
            )

        try:
            company = su_env['res.company'].search([], limit=1)
            # 1. Partner
            partner = su_env['res.partner'].create({
                'name': name,
                'email': user_login,
                'phone': phone,
                'company_id': company.id if company else None,
            })

            # 2. Groups
            group_user = su_env.ref('base.group_user')
            if role == 'athlete':
                group_role = su_env.ref('seha_sports_platform.group_seha_athlete')
            else:
                group_role = su_env.ref('seha_sports_platform.group_seha_guardian')

            # 3. User
            user = su_env['res.users'].create({
                'name': name,
                'login': user_login,
                'email': user_login,
                'password': password,
                'partner_id': partner.id,
                'company_id': company.id if company else 1,
                'company_ids': [(6, 0, [company.id])] if company else [],
                'group_ids': [(6, 0, [group_user.id, group_role.id])],
            })

            created_player = None
            created_parent = None

            # 4. Role specific record
            if role == 'athlete':
                dob = None
                gender = 'male'
                try:
                    century = '19' if national_id[0] == '2' else '20'
                    year = int(century + national_id[1:3])
                    month = int(national_id[3:5])
                    day = int(national_id[5:7])
                    dob = date(year, month, day)
                    gender = 'male' if int(national_id[12]) % 2 == 1 else 'female'
                except Exception:
                    dob = date(2005, 1, 1)

                sport = su_env['seha.sport'].search([], limit=1)
                player_vals = {
                    'name': name,
                    'national_id': national_id,
                    'dob': dob,
                    'gender': gender,
                    'phone': phone,
                    'email': user_login,
                    'sport_id': sport.id if sport else 1,
                    'competition_level': 'level_1',
                    'partner_id': partner.id,
                    'user_id': user.id,
                }
                created_player = su_env['seha.player'].create(player_vals)
            else:
                parent_vals = {
                    'name': name,
                    'national_id': national_id,
                    'phone': phone,
                    'email': user_login,
                    'relationship_type': 'father',
                    'verification_status': 'verified',
                    'partner_id': partner.id,
                    'user_id': user.id,
                }
                created_parent = su_env['seha.parent'].create(parent_vals)

            su_env.cr.commit()

            # Auto authenticate session
            try:
                request.session.authenticate(request.env, {'type': 'password', 'login': user.login, 'password': password})
            except Exception:
                pass

            res_data = {
                'session_id': request.session.sid,
                'user_id': user.id,
                'name': user.name,
                'login': user.login,
                'email': user.email,
                'national_id': national_id,
                'phone': phone,
                'role': role,
                'roles': ['athlete'] if role == 'athlete' else ['guardian'],
                'athlete': {
                    'id': created_player.id,
                    'code': created_player.code,
                    'name': created_player.name,
                    'national_id': created_player.national_id,
                } if created_player else None,
                'guardian': {
                    'id': created_parent.id,
                    'code': created_parent.code,
                    'name': created_parent.name,
                    'national_id': created_parent.national_id,
                } if created_parent else None,
            }
            return json_response(res_data, status=201)

        except Exception as e:
            _logger.exception("Registration failed: %s", str(e))
            return error_response(f"فشل إنشاء الحساب: {str(e)}", status=500, error_code='REGISTRATION_ERROR')

    @http.route('/api/v1/auth/me', type='http', auth='user', methods=['GET'], csrf=False)
    def api_me(self, **kwargs):
        ctx = self._resolve_user_context(request.env.user)
        return json_response({
            'user_id': request.env.user.id,
            'name': request.env.user.name,
            'email': request.env.user.email,
            'roles': ctx['roles'],
            'primary_role': ctx['primary_role'],
            'athlete_id': ctx['player'].id if ctx['player'] else None,
            'guardian_id': ctx['parent'].id if ctx['parent'] else None,
        })

    # -------------------------------------------------------------------------
    # Athlete Endpoints
    # -------------------------------------------------------------------------
    @http.route('/api/v1/players/me', type='http', auth='user', methods=['GET'], csrf=False)
    def api_player_me(self, **kwargs):
        ctx = self._resolve_user_context(request.env.user)
        player = ctx['player']
        if not player:
            return error_response(_("No athlete profile linked to current account."), status=404, error_code='NO_ATHLETE_PROFILE')

        data = {
            'id': player.id,
            'code': player.code,
            'name': player.name,
            'national_id': player.national_id,
            'dob': str(player.dob) if player.dob else None,
            'age': player.age,
            'gender': player.gender,
            'phone': player.phone,
            'email': player.email,
            'sport': {
                'id': player.sport_id.id,
                'name': player.sport_id.name,
                'name_en': player.sport_id.name_en,
            } if player.sport_id else None,
            'competition_level': player.competition_level,
            'club_name': player.club_name,
            'fitness_status': player.fitness_status,
            'primary_guardian': player.guardian_name,
            'certificate_count': player.certificate_count,
            'active_certificate': {
                'id': player.active_certificate_id.id,
                'name': player.active_certificate_id.name,
                'level': player.active_certificate_id.level,
                'issue_date': str(player.active_certificate_id.issue_date),
                'expiry_date': str(player.active_certificate_id.expiry_date),
                'state': player.active_certificate_id.state,
                'is_valid': player.active_certificate_id.is_valid,
                'hospital': player.active_certificate_id.issuing_hospital,
            } if player.active_certificate_id else None,
        }
        return json_response(data)

    @http.route('/api/v1/players/me', type='http', auth='user', methods=['PATCH'], csrf=False)
    def api_player_update_me(self, **kwargs):
        ctx = self._resolve_user_context(request.env.user)
        player = ctx['player']
        if not player:
            return error_response(_("No athlete profile found."), status=404)

        raw_body = request.httprequest.get_data(as_text=True)
        try:
            data = json.loads(raw_body) if raw_body else {}
        except Exception:
            data = dict(request.params) if request.params else {}

        # Only allow updating non-identity contact fields
        allowed_fields = ['phone', 'email']
        vals = {k: data[k] for k in allowed_fields if k in data}
        if vals:
            player.write(vals)

        return json_response({'message': _('Profile updated successfully'), 'id': player.id})

    @http.route('/api/v1/players/me/certificates', type='http', auth='user', methods=['GET'], csrf=False)
    def api_player_me_certificates(self, **kwargs):
        ctx = self._resolve_user_context(request.env.user)
        player = ctx['player']
        if not player:
            return error_response(_("No athlete profile found."), status=404)

        certs = []
        for c in player.certificate_ids.sorted('issue_date', reverse=True):
            certs.append({
                'id': c.id,
                'name': c.name,
                'type': c.certificate_type,
                'level': c.level,
                'issue_date': str(c.issue_date),
                'expiry_date': str(c.expiry_date),
                'state': c.state,
                'is_valid': c.is_valid,
                'hospital': c.issuing_hospital,
                'physician': c.physician_name,
                'decree': c.decree_reference,
                'qr_hash': c.qr_code_hash,
            })
        return json_response(certs)

    # -------------------------------------------------------------------------
    # Parent & Family Hub Endpoints
    # -------------------------------------------------------------------------
    @http.route('/api/v1/parents/me', type='http', auth='user', methods=['GET'], csrf=False)
    def api_parent_me(self, **kwargs):
        ctx = self._resolve_user_context(request.env.user)
        parent = ctx['parent']
        if not parent:
            return error_response(_("No guardian profile linked to current account."), status=404, error_code='NO_GUARDIAN_PROFILE')

        data = {
            'id': parent.id,
            'code': parent.code,
            'name': parent.name,
            'national_id': parent.national_id,
            'phone': parent.phone,
            'email': parent.email,
            'relationship_type': parent.relationship_type,
            'verification_status': parent.verification_status,
            'children_count': parent.children_count,
        }
        return json_response(data)

    @http.route('/api/v1/parents/me/children', type='http', auth='user', methods=['GET'], csrf=False)
    def api_parent_children(self, **kwargs):
        ctx = self._resolve_user_context(request.env.user)
        parent = ctx['parent']
        if not parent:
            return error_response(_("No guardian profile found."), status=404)

        children = []
        for ch in parent.player_ids.filtered(lambda p: p.active):
            children.append({
                'id': ch.id,
                'code': ch.code,
                'name': ch.name,
                'gender': ch.gender,
                'age': ch.age,
                'dob': str(ch.dob) if ch.dob else None,
                'national_id': ch.national_id,
                'sport': {
                    'id': ch.sport_id.id,
                    'name': ch.sport_id.name,
                } if ch.sport_id else None,
                'competition_level': ch.competition_level,
                'club_name': ch.club_name,
                'fitness_status': ch.fitness_status,
                'certificate_count': ch.certificate_count,
                'active_certificate': {
                    'id': ch.active_certificate_id.id,
                    'name': ch.active_certificate_id.name,
                    'state': ch.active_certificate_id.state,
                    'is_valid': ch.active_certificate_id.is_valid,
                    'expiry_date': str(ch.active_certificate_id.expiry_date) if ch.active_certificate_id else None,
                } if ch.active_certificate_id else None,
            })
        return json_response(children)

    @http.route('/api/v1/players/<int:player_id>', type='http', auth='user', methods=['GET'], csrf=False)
    def api_player_detail(self, player_id, **kwargs):
        """Strictly enforces authorization: user must be the athlete himself, or an authorized guardian, or admin/medical."""
        user = request.env.user
        ctx = self._resolve_user_context(user)
        
        player = request.env['seha.player'].browse(player_id)
        if not player.exists():
            return error_response(_("Athlete record not found."), status=404)

        # Check authorization
        is_admin_or_med = 'super_admin' in ctx['roles'] or 'medical_staff' in ctx['roles']
        is_self = ctx['player'] and ctx['player'].id == player.id
        is_authorized_parent = ctx['parent'] and player in ctx['parent'].player_ids

        if not (is_admin_or_med or is_self or is_authorized_parent):
            return error_response(_("Unauthorized to access this athlete record."), status=403, error_code='ACCESS_DENIED')

        data = {
            'id': player.id,
            'code': player.code,
            'name': player.name,
            'national_id': player.national_id,
            'dob': str(player.dob) if player.dob else None,
            'age': player.age,
            'gender': player.gender,
            'sport': {
                'id': player.sport_id.id,
                'name': player.sport_id.name,
            } if player.sport_id else None,
            'competition_level': player.competition_level,
            'club_name': player.club_name,
            'fitness_status': player.fitness_status,
            'guardian_name': player.guardian_name,
        }
        return json_response(data)

    @http.route('/api/v1/players/<int:player_id>/certificates', type='http', auth='user', methods=['GET'], csrf=False)
    def api_player_certificates(self, player_id, **kwargs):
        """Returns certificates of a specific player after verifying guardian / self authorization."""
        user = request.env.user
        ctx = self._resolve_user_context(user)
        
        player = request.env['seha.player'].browse(player_id)
        if not player.exists():
            return error_response(_("Athlete record not found."), status=404)

        is_admin_or_med = 'super_admin' in ctx['roles'] or 'medical_staff' in ctx['roles']
        is_self = ctx['player'] and ctx['player'].id == player.id
        is_authorized_parent = ctx['parent'] and player in ctx['parent'].player_ids

        if not (is_admin_or_med or is_self or is_authorized_parent):
            return error_response(_("Unauthorized to view certificates for this athlete."), status=403)

        certs = []
        for c in player.certificate_ids.sorted('issue_date', reverse=True):
            certs.append({
                'id': c.id,
                'name': c.name,
                'type': c.certificate_type,
                'level': c.level,
                'issue_date': str(c.issue_date),
                'expiry_date': str(c.expiry_date),
                'state': c.state,
                'is_valid': c.is_valid,
                'hospital': c.issuing_hospital,
                'physician': c.physician_name,
                'qr_hash': c.qr_code_hash,
            })
        return json_response(certs)

    # -------------------------------------------------------------------------
    # Public & Official Verification Endpoint (QR Scan)
    # -------------------------------------------------------------------------
    @http.route('/api/v1/certificates/verify/<string:qr_hash>', type='http', auth='none', methods=['GET'], csrf=False)
    def api_verify_certificate(self, qr_hash, **kwargs):
        """Publicly verifies certificate validity from QR code scan without exposing sensitive medical notes or National IDs."""
        cert = request.env['seha.medical.certificate'].sudo().search([('qr_code_hash', '=', qr_hash)], limit=1)
        if not cert:
            return error_response(_("Invalid or unrecognized certificate verification code."), status=404, error_code='CERT_NOT_FOUND')

        return json_response({
            'valid': cert.is_valid,
            'certificate_number': cert.name,
            'status': cert.state,
            'athlete_name': cert.player_id.name,
            'sport': cert.player_id.sport_id.name if cert.player_id.sport_id else None,
            'level': cert.level,
            'issue_date': str(cert.issue_date),
            'expiry_date': str(cert.expiry_date),
            'hospital': cert.issuing_hospital,
            'decree': cert.decree_reference,
            'verification_timestamp': date.today().isoformat(),
        })
