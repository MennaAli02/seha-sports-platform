#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate backend/odoo.conf dynamically from .env file for local and multi-server deployments.

Usage:
    python backend/generate_conf.py
"""

import os
from pathlib import Path


def parse_env_file(env_path):
    """Parse a key=value .env file into a dictionary."""
    config = {}
    if not os.path.exists(env_path):
        return config
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                config[k] = v
    return config


def main():
    root_dir = Path(__file__).resolve().parent.parent
    backend_dir = root_dir / 'backend'

    # Load root .env first, then backend/.env if exists
    env_vars = {}
    for candidate in [root_dir / '.env', backend_dir / '.env']:
        if candidate.exists():
            env_vars.update(parse_env_file(candidate))

    # Environment variables take highest precedence
    for k, v in os.environ.items():
        env_vars[k] = v

    addons_path = env_vars.get('ODOO_ADDONS_PATH', '/mnt/extra-addons,/usr/lib/python3/dist-packages/odoo/addons')
    admin_passwd = env_vars.get('ODOO_ADMIN_PASSWORD', '')
    db_host = env_vars.get('DB_HOST', 'seha-db')
    db_port = env_vars.get('DB_PORT', '5432')
    db_user = env_vars.get('DB_USER', '')
    db_password = env_vars.get('DB_PASSWORD', '')
    http_port = env_vars.get('ODOO_PORT', '8022')
    db_name = env_vars.get('ODOO_DB_NAME', '')

    conf_lines = [
        "[options]",
        f"addons_path = {addons_path}",
        f"admin_passwd = {admin_passwd}",
        f"db_host = {db_host}",
        f"db_port = {db_port}",
        f"db_user = {db_user}",
        f"db_password = {db_password}",
        f"http_port = {http_port}",
        "proxy_mode = True",
        "list_db = True",
    ]
    if db_name:
        conf_lines.append(f"db_name = {db_name}")

    out_file = backend_dir / 'odoo.conf'
    out_file.write_text('\n'.join(conf_lines) + '\n', encoding='utf-8')
    print(f"[OK] Generated {out_file} successfully from environment variables.")


if __name__ == '__main__':
    main()
