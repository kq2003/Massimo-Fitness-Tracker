"""Add basic_info table

Revision ID: e54dd361d2a8
Revises: a69d55a6dc50
Create Date: 2025-01-22 00:36:37.237906

"""
from alembic import op
import sqlalchemy as sa


# Revision identifiers, used by Alembic
revision = 'e54dd361d2a8'
down_revision = 'a69d55a6dc50'
branch_labels = None
depends_on = None


def upgrade():
    # Create the `basic_info` table
    op.create_table(
        'basic_info',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('height', sa.Float(), nullable=False),
        sa.Column('weight', sa.Float(), nullable=False),
        sa.Column('ideal_weight', sa.Float(), nullable=False),
        sa.Column('ideal_body_fat', sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # No changes to `exercise_categories` or `exercises`


def downgrade():
    # Drop the `basic_info` table
    op.drop_table('basic_info')

    # No changes to `exercise_categories` or `exercises`

