"""empty message

Revision ID: 99e88b9c2f3b
Revises: 13e7c3e0687b
Create Date: 2025-01-31 13:02:53.367827

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99e88b9c2f3b'
down_revision = '13e7c3e0687b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date', sa.String(length=80), default=sa.DateTime(), nullable=False)) 

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.drop_column('date')

    # ### end Alembic commands ###
