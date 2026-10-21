# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class SehaSport(models.Model):
    _name = 'seha.sport'
    _description = 'Sport / Athletic Discipline'
    _order = 'sequence, name'

    name = fields.Char(string='Sport Name (Arabic)', required=True, translate=True)
    name_en = fields.Char(string='Sport Name (English)')
    code = fields.Char(string='Code', size=10)
    sequence = fields.Integer(string='Sequence', default=10)
    active = fields.Boolean(default=True)
    description = fields.Text(string='Description')

    @api.constrains('code')
    def _check_code_unique(self):
        for record in self:
            if record.code:
                existing = self.search([
                    ('code', '=', record.code),
                    ('id', '!=', record.id)
                ], limit=1)
                if existing:
                    raise ValidationError(_("The sport code %s must be unique!") % record.code)
