# -*- coding: utf-8 -*-
from datetime import date, timedelta
from odoo.tests.common import TransactionCase
from odoo.exceptions import ValidationError


class TestSehaPlayer(TransactionCase):

    def setUp(self):
        super().setUp()
        self.sport = self.env.ref('seha_sports_platform.sport_football', raise_if_not_found=False)
        if not self.sport:
            self.sport = self.env['seha.sport'].search([], limit=1)

    def test_01_create_player_success(self):
        """Test successful player creation and auto-generation of code and partner."""
        player = self.env['seha.player'].create({
            'name': 'أحمد يوسف السيد (اختبار)',
            'national_id': '30408150104899',
            'dob': date(2010, 5, 12),
            'gender': 'male',
            'sport_id': self.sport.id,
            'competition_level': 'level_3',
        })
        self.assertTrue(player.id)
        self.assertTrue(player.partner_id)
        self.assertEqual(player.partner_id.name, 'أحمد يوسف السيد (اختبار)')
        self.assertTrue(player.code)
        self.assertNotEqual(player.code, 'New')
        self.assertGreater(player.age, 0)

    def test_02_national_id_length_validation(self):
        """National ID must be strictly 14 numeric digits."""
        with self.assertRaises(ValidationError):
            self.env['seha.player'].create({
                'name': 'لاعب غير صحيح',
                'national_id': '12345',  # too short
                'dob': date(2010, 5, 12),
                'gender': 'male',
                'sport_id': self.sport.id,
            })

    def test_03_dob_future_validation(self):
        """Date of birth cannot be in the future."""
        future_date = date.today() + timedelta(days=30)
        with self.assertRaises(ValidationError):
            self.env['seha.player'].create({
                'name': 'لاعب مستقبلي',
                'national_id': '30408150108888',
                'dob': future_date,
                'gender': 'male',
                'sport_id': self.sport.id,
            })
