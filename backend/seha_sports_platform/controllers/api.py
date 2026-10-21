# -*- coding: utf-8 -*-
import json
import logging
from datetime import date
from odoo import http, _
from odoo.http import request

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
        try:
            data = json.loads(request.httprequest.data.decode('utf-8'))
        except Exception:
            data = request.params

        login = data.get('login') or data.get('identifier')
        password = data.get('password')
        role_hint = data.get('role')
        db = request.db or 'sports_platform'

        if not login or not password:
            return error_response(_("Login identifier and password are required."), status=400, error_code='MISSING_CREDENTIALS')

        # If user passed a 14-digit National ID, attempt resolving login email/username
        clean_nid = ''.join(c for c in str(login) if c.isdigit())
        actual_login = login
        if len(clean_nid) == 14:
            # Look up partner or user with this national ID
            player = request.env['seha.player'].sudo().search([('national_id', '=', clean_nid)], limit=1)
            parent = request.env['seha.parent'].sudo().search([('national_id', '=', clean_nid)], limit=1)
            
            target_user = None
            if role_hint == 'athlete' and player and player.user_id:
                target_user = player.user_id
            elif role_hint == 'guardian' and parent and parent.user_id:
                target_user = parent.user_id
            elif parent and parent.user_id:
                target_user = parent.user_id
            elif player and player.user_id:
                target_user = player.user_id

            if target_user:
                actual_login = target_user.login

        try:
            uid = request.session.authenticate(db, actual_login, password)
        except Exception as e:
            _logger.warning("Failed login attempt for %s: %s", login, str(e))
            return error_response(_("Invalid credentials or access denied."), status=401, error_code='AUTH_FAILED')

        if not uid:
            return error_response(_("Authentication failed."), status=401, error_code='AUTH_FAILED')

        user = request.env['res.users'].browse(uid)
        ctx = self._resolve_user_context(user)

        res_data = {
            'session_id': request.session.sid,
            'user_id': user.id,
            'name': user.name,
            'email': user.email,
            'roles': ctx['roles'],
            'primary_role': ctx['primary_role'],
            'athlete': {
                'id': ctx['player'].id,
                'code': ctx['player'].code,
                'name': ctx['player'].name,
            } if ctx['player'] else None,
            'guardian': {
                'id': ctx['parent'].id,
                'code': ctx['parent'].code,
                'name': ctx['parent'].name,
            } if ctx['parent'] else None,
        }
        return json_response(res_data)

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

        try:
            data = json.loads(request.httprequest.data.decode('utf-8'))
        except Exception:
            data = request.params

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
