# -*- coding: utf-8 -*-
from datetime import date
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class SehaPlayer(models.Model):
    _name = 'seha.player'
    _description = 'Athlete / Sports Player Profile'
    _order = 'name, id desc'

    name = fields.Char(string='Full Name', required=True, index=True)
    code = fields.Char(string='Athlete Reference', readonly=True, copy=False, default=lambda self: _('New'))
    
    partner_id = fields.Many2one(
        'res.partner',
        string='Contact Record',
        required=True,
        ondelete='restrict',
        help='Canonical partner identity record in Odoo'
    )
    user_id = fields.Many2one(
        'res.users',
        string='Portal User Account',
        help='Linked portal login account if registered'
    )
    
    national_id = fields.Char(
        string='National ID (الرقم القومي)',
        size=14,
        index=True,
        copy=False,
        help='Egyptian National Identification Number (14 digits)'
    )
    
    dob = fields.Date(string='Date of Birth', required=True)
    age = fields.Integer(string='Age', compute='_compute_age', store=True)
    gender = fields.Selection([
        ('male', 'Male / ذكر'),
        ('female', 'Female / أنثى'),
    ], string='Gender', default='male', required=True)
    
    phone = fields.Char(string='Phone / Mobile')
    email = fields.Char(string='Email')
    governorate = fields.Char(string='Governorate / المحافظة', default='القاهرة')
    
    sport_id = fields.Many2one('seha.sport', string='Sport / Discipline', required=True)
    competition_level = fields.Selection([
        ('level_1', 'Level 1 — Schools & Academies (المستوى الأول)'),
        ('level_2', 'Level 2 — Sporting Clubs (المستوى الثاني)'),
        ('level_3', 'Level 3 — National Tournaments & Federations (المستوى الثالث)'),
    ], string='Competition Level', default='level_2', required=True)
    
    club_name = fields.Char(string='Sports Club / الأكاديمية أو النادي', default='نادي المستقبل الرياضي')
    
    fitness_status = fields.Selection([
        ('fit', 'Medically Fit / لائق رياضياً'),
        ('conditional', 'Conditional Clearance / لائق بشروط'),
        ('unfit', 'Temporarily Unfit / غير لائق مؤقتاً'),
        ('pending', 'Pending Examination / قيد الكشف الطبي'),
    ], string='Medical Fitness Status', default='fit')
    
    parent_ids = fields.Many2many(
        'seha.parent',
        'seha_parent_player_rel',
        'player_id',
        'parent_id',
        string='Parents / Legal Guardians'
    )
    parent_relation_ids = fields.One2many(
        'seha.parent.player.relation',
        'player_id',
        string='Parent Relationships'
    )
    guardian_name = fields.Char(
        string='Primary Guardian',
        compute='_compute_guardian_name',
        store=True
    )
    
    certificate_ids = fields.One2many(
        'seha.medical.certificate',
        'player_id',
        string='Medical Certificates'
    )
    certificate_count = fields.Integer(
        string='Certificates Count',
        compute='_compute_certificate_count'
    )
    active_certificate_id = fields.Many2one(
        'seha.medical.certificate',
        string='Active Certificate',
        compute='_compute_active_certificate'
    )
    
    active = fields.Boolean(default=True)
    notes = fields.Text(string='Administrative Notes')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('code', _('New')) == _('New'):
                vals['code'] = self.env['ir.sequence'].next_by_code('seha.player') or _('New')
            
            # Ensure partner exists or is synchronized
            if not vals.get('partner_id'):
                partner_vals = {
                    'name': vals.get('name'),
                    'email': vals.get('email'),
                    'phone': vals.get('phone'),
                    'is_company': False,
                }
                partner = self.env['res.partner'].create(partner_vals)
                vals['partner_id'] = partner.id
        return super().create(vals_list)

    def write(self, vals):
        res = super().write(vals)
        for record in self:
            partner_vals = {}
            if 'name' in vals and record.partner_id.name != record.name:
                partner_vals['name'] = record.name
            if 'email' in vals and record.partner_id.email != record.email:
                partner_vals['email'] = record.email
            if 'phone' in vals and record.partner_id.phone != record.phone:
                partner_vals['phone'] = record.phone
            if partner_vals and record.partner_id:
                record.partner_id.write(partner_vals)
        return res

    @api.depends('dob')
    def _compute_age(self):
        today = date.today()
        for record in self:
            if record.dob:
                record.age = today.year - record.dob.year - (
                    (today.month, today.day) < (record.dob.month, record.dob.day)
                )
            else:
                record.age = 0

    @api.depends('parent_ids', 'parent_relation_ids.parent_id')
    def _compute_guardian_name(self):
        for record in self:
            if record.parent_ids:
                record.guardian_name = record.parent_ids[0].name
            elif record.parent_relation_ids:
                record.guardian_name = record.parent_relation_ids[0].parent_id.name
            else:
                record.guardian_name = False

    @api.depends('certificate_ids')
    def _compute_certificate_count(self):
        for record in self:
            record.certificate_count = len(record.certificate_ids)

    @api.depends('certificate_ids.state', 'certificate_ids.expiry_date')
    def _compute_active_certificate(self):
        today = date.today()
        for record in self:
            valid_certs = record.certificate_ids.filtered(
                lambda c: c.state == 'valid' and c.expiry_date and c.expiry_date >= today
            ).sorted('expiry_date', reverse=True)
            record.active_certificate_id = valid_certs[0] if valid_certs else False

    @api.constrains('national_id')
    def _check_national_id(self):
        for record in self:
            if not record.national_id:
                continue
            cleaned = ''.join(c for c in record.national_id if c.isdigit())
            if len(cleaned) != 14:
                raise ValidationError(_("National ID must be exactly 14 numeric digits. Provided: %s") % record.national_id)
            existing = self.search([
                ('national_id', '=', record.national_id),
                ('id', '!=', record.id)
            ], limit=1)
            if existing:
                raise ValidationError(_("Another athlete with National ID %s already exists!") % record.national_id)

    @api.constrains('dob')
    def _check_dob(self):
        today = date.today()
        for record in self:
            if record.dob and record.dob > today:
                raise ValidationError(_("Date of birth cannot be in the future."))
