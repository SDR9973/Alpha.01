"""add_research_id_to_threads

Revision ID: 97fa5a07f6e1
Revises: 1a2b3c4d5e6f
Create Date: 2025-03-23 09:05:21.610719+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

"""add_research_id_to_threads

Revision ID: {new_revision_id}
Revises: 1a2b3c4d5e6f
Create Date: {current_date}

"""


# revision identifiers, used by Alembic.
revision = '{new_revision_id}'  # Replace with the generated revision ID
down_revision = '1a2b3c4d5e6f'  # This should match your initial migration ID
branch_labels = None
depends_on = None


def upgrade():
    # Add research_id column to threads table
    op.add_column('threads', sa.Column('research_id', postgresql.UUID(), nullable=True))

    # Add foreign key constraint
    op.create_foreign_key(
        'fk_threads_research_id_researches',
        'threads', 'researches',
        ['research_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade():
    # Drop foreign key first
    op.drop_constraint('fk_threads_research_id_researches', 'threads', type_='foreignkey')

    # Drop column
    op.drop_column('threads', 'research_id')