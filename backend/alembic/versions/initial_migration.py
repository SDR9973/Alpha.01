"""Initial migration

Revision ID: 1a2b3c4d5e6f
Revises:
Create Date: 2025-03-21 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1a2b3c4d5e6f'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=True),
        sa.Column('avatar', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    # Create index on email
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create researches table
    op.create_table(
        'researches',
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('start_date', sa.String(), nullable=True),
        sa.Column('end_date', sa.String(), nullable=True),
        sa.Column('message_limit', sa.Integer(), nullable=True),
        sa.Column('file_name', sa.String(), nullable=True),
        sa.Column('anonymized', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create network_analyses table
    op.create_table(
        'network_analyses',
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('research_id', postgresql.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('node_count', sa.Integer(), nullable=True),
        sa.Column('edge_count', sa.Integer(), nullable=True),
        sa.Column('density', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['research_id'], ['researches.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create nodes table
    op.create_table(
        'nodes',
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('node_id', sa.String(), nullable=False),
        sa.Column('analysis_id', postgresql.UUID(), nullable=False),
        sa.Column('messages', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('degree', sa.Float(), nullable=False, server_default=sa.text('0')),
        sa.Column('betweenness', sa.Float(), nullable=False, server_default=sa.text('0')),
        sa.Column('closeness', sa.Float(), nullable=False, server_default=sa.text('0')),
        sa.Column('eigenvector', sa.Float(), nullable=False, server_default=sa.text('0')),
        sa.Column('pagerank', sa.Float(), nullable=False, server_default=sa.text('0')),
        sa.ForeignKeyConstraint(['analysis_id'], ['network_analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create links table
    op.create_table(
        'links',
        sa.Column('id', postgresql.UUID(), nullable=False),
        sa.Column('source', sa.String(), nullable=False),
        sa.Column('target', sa.String(), nullable=False),
        sa.Column('weight', sa.Integer(), nullable=False, server_default=sa.text('1')),
        sa.Column('analysis_id', postgresql.UUID(), nullable=False),
        sa.ForeignKeyConstraint(['analysis_id'], ['network_analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    # Drop tables in reverse order
    op.drop_table('links')
    op.drop_table('nodes')
    op.drop_table('network_analyses')
    op.drop_table('researches')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')