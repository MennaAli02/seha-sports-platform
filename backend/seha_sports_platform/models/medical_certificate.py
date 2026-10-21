# -*- coding: utf-8 -*-
import hashlib
from datetime import date
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class SehaMedicalCertificate(models.Model):
    _name = 'seha.medical.certificate'
    _description = 'Unified Sports Medical Certificate (الشهادة الطبية الرياضية الموحدة)'
    _order = 'issue_date desc, id desc'

    name = fields.Char(
        string='Certificate Number (رقم الشهادة الموحدة)',
        readonly=True,
        copy=False,
        default=lambda self: _('New'),
        index=True
    )
    
    player_id = fields.Many2one(
        'seha.player',
        string='Athlete / الرياضي',
        required=True,
        ondelete='restrict',
        index=True
    )
    athlete_name = fields.Char(related='player_id.name', string='Athlete Name', readonly=True)
    athlete_national_id = fields.Char(related='player_id.national_id', string='National ID', readonly=True)
    sport_id = fields.Many2one(related='player_id.sport_id', string='Sport', readonly=True)
    
    certificate_type = fields.Selection([
        ('comprehensive', 'Comprehensive Sports Clearance / كشف طبي شامل للرياضيين'),
        ('cardiac', 'Cardiovascular Safety Certificate / كشف سلامة القلب'),
        ('periodic', 'Periodic Seasonal Renewal / تجديد دوري للموسم الرياضي'),
    ], string='Certificate Type', default='comprehensive', required=True)
    
    level = fields.Selection([
        ('level_1', 'Level 1 — General Fitness (المستوى الأول)'),
        ('level_2', 'Level 2 — Competitive Youth (المستوى الثاني)'),
        ('level_3', 'Level 3 — National Tournaments & Federations (المستوى الثالث)'),
    ], string='Accredited Medical Level', default='level_2', required=True)
    
    issue_date = fields.Date(
        string='Issue Date (تاريخ الإصدار)',
        default=fields.Date.context_today,
        required=True
    )
    expiry_date = fields.Date(
        string='Expiry Date (تاريخ الانتهاء)',
        required=True
    )
    
    state = fields.Selection([
        ('draft', 'Draft / مسودة'),
        ('valid', 'Valid & Certified / سارية ومعتمدة رسمياً'),
        ('expired', 'Expired / منتهية الصلاحية'),
        ('suspended', 'Suspended / معلقة للمتابعة'),
        ('revoked', 'Revoked / ملغاة'),
    ], string='Certificate Status', default='valid', required=True, index=True)
    
    is_valid = fields.Boolean(
        string='Is Medically Valid Now',
        compute='_compute_is_valid',
        store=True,
        help='True if certified and not expired as of current date'
    )
    
    issuing_hospital = fields.Char(
        string='Accredited Medical Unit / المستشفى المعتمد',
        default='مستشفى هليوبوليس التخصصي',
        required=True
    )
    physician_name = fields.Char(
        string='Accredited Examining Physician / الطبيب المعتمد',
        default='د. عصام عبدالمجيد'
    )
    physician_license = fields.Char(
        string='Syndicate License / رقم القيد النقابي',
        default='EGY-MED-44912'
    )
    issued_by_user_id = fields.Many2one(
        'res.users',
        string='Issued by User',
        default=lambda self: self.env.user
    )
    
    decree_reference = fields.Char(
        string='Decree Reference / السند القانوني',
        default='قرار رئيس مجلس الوزراء رقم 1642 لسنة 2024'
    )
    law_compliance = fields.Char(
        string='Data Protection Law',
        default='قانون حماية البيانات الشخصية رقم 151 لسنة 2020'
    )
    
    qr_code_hash = fields.Char(
        string='Digital Verification Hash',
        compute='_compute_qr_code_hash',
        store=True,
        index=True
    )
    
    notes = fields.Text(string='Clinical Observations & Medical Recommendations')
    active = fields.Boolean(default=True)

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', _('New')) == _('New'):
                vals['name'] = self.env['ir.sequence'].next_by_code('seha.medical.certificate') or _('New')
            
            # Default expiry date to 1 year from issue date if not set
            if not vals.get('expiry_date') and vals.get('issue_date'):
                issue = fields.Date.from_string(vals['issue_date'])
                try:
                    vals['expiry_date'] = issue.replace(year=issue.year + 1)
                except ValueError:
                    vals['expiry_date'] = issue.replace(year=issue.year + 1, day=28)
        return super().create(vals_list)

    @api.depends('state', 'expiry_date')
    def _compute_is_valid(self):
        today = date.today()
        for record in self:
            record.is_valid = bool(
                record.state == 'valid' and record.expiry_date and record.expiry_date >= today
            )

    @api.depends('name', 'player_id.national_id', 'issue_date')
    def _compute_qr_code_hash(self):
        for record in self:
            if record.name and record.name != _('New'):
                raw = f"SEHA:{record.name}:{record.player_id.national_id or ''}:{record.issue_date or ''}"
                record.qr_code_hash = hashlib.sha256(raw.encode('utf-8')).hexdigest()[:24].upper()
            else:
                record.qr_code_hash = False

    @api.constrains('issue_date', 'expiry_date')
    def _check_dates(self):
        for record in self:
            if record.issue_date and record.expiry_date and record.expiry_date < record.issue_date:
                raise ValidationError(_("Certificate expiry date cannot be earlier than its issue date."))

    @api.constrains('name')
    def _check_unique_name(self):
        for record in self:
            if record.name and record.name != _('New'):
                existing = self.search([
                    ('name', '=', record.name),
                    ('id', '!=', record.id)
                ], limit=1)
                if existing:
                    raise ValidationError(_("The certificate number %s must be strictly unique!") % record.name)

    def action_validate(self):
        self.write({'state': 'valid'})

    def action_suspend(self):
        self.write({'state': 'suspended'})

    def action_revoke(self):
        self.write({'state': 'revoked'})
