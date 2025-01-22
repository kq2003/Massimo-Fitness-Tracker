"""Dummy migration to match database state

Revision ID: a69d55a6dc50
Revises: 20e97a1b9148
Create Date: 2025-01-22 00:35:00.283825

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a69d55a6dc50'
down_revision = '20e97a1b9148'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
