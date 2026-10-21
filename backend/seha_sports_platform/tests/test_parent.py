# -*- coding: utf-8 -*-
from datetime import date
from odoo.tests.common import TransactionCase
from odoo.exceptions import ValidationError


class TestSehaParent(TransactionCase):

    def setUp(self):
        super().setUp()
        self.sport = self.env['seha.sport'].create({
            'name': 'السباحة',
            'code': 'SWIM',
        })
        self.player_1 = self.env['seha.player'].create({
            'name': 'أحمد يوسف',
            'national_id': '30408150104801',
            'dob': date(2010, 5, 12),
            'gender': 'male',
            'sport_id': self.sport.id,
        })
        self.player_2 = self.env['seha.player'].create({
            'name': 'مريم أحمد',
            'national_id': '30806120104802',
            'dob': date(2012, 8, 20),
            'gender': 'female',
            'sport_id': self.sport.id,
        })

    def test_01_create_parent_and_link_children(self):
        """Test creating a guardian and connecting multiple children."""
        parent = self.env['seha.parent'].create({
            'name': 'يوسف عبدالله السيد',
            'national_id': '27501010104800',
            'phone': '01012345678',
            'relationship_type': 'father',
            'player_ids': [(6, 0, [self.player_1.id, self.player_2.id])],
        })
        self.assertTrue(parent.id)
        self.assertEqual(parent.children_count, 2)
        self.assertIn(self.player_1, parent.player_ids)
        self.assertIn(self.player_2, parent.player_ids)
        self.assertEqual(self.player_1.guardian_name, 'يوسف عبدالله السيد')

    def test_02_national_id_validation(self):
        """National ID must be strictly 14 numeric digits."""
        with self.assertRaises(ValidationError):
            self.env['seha.parent'].create({
                'name': 'ولي أمر غير صحيح',
                'national_id': 'abc12345678901',  # non-digits
            })
