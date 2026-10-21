# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class SehaParent(models.Model):
    _name = 'seha.parent'
    _description = 'Parent / Legal Guardian Profile'
    _order = 'name, id desc'

    name = fields.Char(string='Full Name', required=True, index=True)
    code = fields.Char(string='Guardian Reference', readonly=True, copy=False, default=lambda self: _('New'))
    
    partner_id = fields.Many2one(
        'res.partner',
        string='Contact Record',
        required=True,
        ondelete='restrict',
        help='Canonical partner record in Odoo'
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
    
    phone = fields.Char(string='Mobile Phone')
    email = fields.Char(string='Email')
    
    relationship_type = fields.Selection([
        ('father', 'Father / أب'),
        ('mother', 'Mother / أم'),
        ('guardian', 'Legal Guardian / وصي قانوني'),
    ], string='Guardian Relationship', default='father', required=True)
    
    player_ids = fields.Many2many(
        'seha.player',
        'seha_parent_player_rel',
        'parent_id',
        'player_id',
        string='Connected Athlete Children'
    )
    player_relation_ids = fields.One2many(
        'seha.parent.player.relation',
        'parent_id',
        string='Detailed Athlete Relationships'
    )
    
    children_count = fields.Integer(
        string='Connected Children Count',
        compute='_compute_children_count'
    )
    
    verification_status = fields.Selection([
        ('verified', 'Verified / موثق رسمياً'),
        ('pending', 'Pending Verification / قيد الفحص'),
        ('rejected', 'Rejected / مرفوض'),
    ], string='Relationship Verification', default='verified')
    
    active = fields.Boolean(default=True)
    notes = fields.Text(string='Internal Notes')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('code', _('New')) == _('New'):
                vals['code'] = self.env['ir.sequence'].next_by_code('seha.parent') or _('New')
            
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

    @api.depends('player_ids')
    def _compute_children_count(self):
        for record in self:
            record.children_count = len(record.player_ids)

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
                raise ValidationError(_("Another parent with National ID %s already exists!") % record.national_id)


class SehaParentPlayerRelation(models.Model):
    _name = 'seha.parent.player.relation'
    _description = 'Parent-Athlete Relationship Governance'
    _order = 'id desc'

    parent_id = fields.Many2one('seha.parent', string='Guardian', required=True, ondelete='cascade')
    player_id = fields.Many2one('seha.player', string='Athlete Child', required=True, ondelete='cascade')
    
    relationship = fields.Selection([
        ('father', 'Father / أب'),
        ('mother', 'Mother / أم'),
        ('guardian', 'Legal Guardian / وصي قانوني'),
    ], string='Relationship', default='father', required=True)
    
    verification_status = fields.Selection([
        ('verified', 'Verified / موثق'),
        ('pending', 'Pending Verification / قيد المراجعة'),
        ('revoked', 'Revoked / ملغى'),
    ], string='Verification Status', default='verified', required=True)
    
    verification_date = fields.Date(string='Verification Date', default=fields.Date.context_today)
    notes = fields.Text(string='Notes / Document References')

    @api.constrains('parent_id', 'player_id')
    def _check_unique_relation(self):
        for record in self:
            existing = self.search([
                ('parent_id', '=', record.parent_id.id),
                ('player_id', '=', record.player_id.id),
                ('id', '!=', record.id)
            ], limit=1)
            if existing:
                raise ValidationError(_("This parent is already connected to this athlete!"))
