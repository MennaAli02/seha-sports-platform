# -*- coding: utf-8 -*-
from datetime import date, timedelta
from odoo.tests.common import TransactionCase
from odoo.exceptions import ValidationError


class TestSehaCertificate(TransactionCase):

    def setUp(self):
        super().setUp()
        self.sport = self.env.ref('seha_sports_platform.sport_handball', raise_if_not_found=False)
        if not self.sport:
            self.sport = self.env['seha.sport'].search([], limit=1)

        self.player = self.env['seha.player'].create({
            'name': 'أحمد يوسف (اختبار شهادة)',
            'national_id': '30408150104877',
            'dob': date(2010, 5, 12),
            'gender': 'male',
            'sport_id': self.sport.id,
        })

    def test_01_create_valid_certificate(self):
        """Test issuing a valid medical certificate."""
        today = date.today()
        next_year = today + timedelta(days=365)
        cert = self.env['seha.medical.certificate'].create({
            'player_id': self.player.id,
            'certificate_type': 'comprehensive',
            'level': 'level_3',
            'issue_date': today,
            'expiry_date': next_year,
            'state': 'valid',
        })
        self.assertTrue(cert.id)
        self.assertTrue(cert.name)
        self.assertNotEqual(cert.name, 'New')
        self.assertTrue(cert.is_valid)
        self.assertTrue(cert.qr_code_hash)
        self.assertEqual(self.player.active_certificate_id, cert)

    def test_02_expiry_before_issue_validation(self):
        """Expiry date cannot be before issue date."""
        today = date.today()
        yesterday = today - timedelta(days=1)
        with self.assertRaises(ValidationError):
            self.env['seha.medical.certificate'].create({
                'player_id': self.player.id,
                'issue_date': today,
                'expiry_date': yesterday,
            })

    def test_03_expired_status_computation(self):
        """Expired certificate should compute is_valid as False."""
        past_issue = date.today() - timedelta(days=400)
        past_expiry = date.today() - timedelta(days=35)
        cert = self.env['seha.medical.certificate'].create({
            'player_id': self.player.id,
            'issue_date': past_issue,
            'expiry_date': past_expiry,
            'state': 'valid',
        })
        self.assertFalse(cert.is_valid)
