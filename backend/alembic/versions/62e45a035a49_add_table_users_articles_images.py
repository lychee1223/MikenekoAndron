"""[Add Table] Users Articles Images

Revision ID: 62e45a035a49
Revises: 1065ed638c89
Create Date: 2024-01-26 16:21:56.120560

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '62e45a035a49'
down_revision: Union[str, None] = '1065ed638c89'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # op.alter_column('articles', 'id',
    #            existing_type=sa.INTEGER(),
    #            server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
    #            existing_nullable=False,
    #            autoincrement=True)
    # op.alter_column('articles', 'date',
    #            existing_type=sa.DATE(),
    #            type_=sa.DateTime(),
    #            existing_nullable=True)
    # op.create_index(op.f('ix_articles_id'), 'articles', ['id'], unique=False)
    # op.alter_column('images', 'id',
    #            existing_type=sa.INTEGER(),
    #            server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
    #            existing_nullable=False,
    #            autoincrement=True)
    # op.create_index(op.f('ix_images_id'), 'images', ['id'], unique=False)
    # op.create_index(op.f('ix_images_path'), 'images', ['path'], unique=True)
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=True))

    op.create_table('articles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('is_works', sa.Boolean(), nullable=True),
        sa.Column('tag', sa.String(), nullable=True),
        sa.Column('date', sa.DateTime(), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('body', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_articles_id'), 'articles', ['id'], unique=False)
    # op.create_index(op.f('ix_articles_tag'), 'articles', ['tag'], unique=False)
    # op.create_index(op.f('ix_articles_date'), 'articles', ['date'], unique=False)

    op.create_table('images',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('path', sa.String(), nullable=True),
        sa.Column('article_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['article_id'], ['articles.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_images_id'), 'images', ['id'], unique=False)
    #op.create_index(op.f('ix_images_path'), 'images', ['path'], unique=True)
    
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_index(op.f('ix_images_path'), table_name='images')
    # op.drop_index(op.f('ix_images_id'), table_name='images')
    # op.alter_column('images', 'id',
    #            existing_type=sa.INTEGER(),
    #            server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
    #            existing_nullable=False,
    #            autoincrement=True)
    # op.drop_index(op.f('ix_articles_id'), table_name='articles')
    # op.alter_column('articles', 'date',
    #            existing_type=sa.DateTime(),
    #            type_=sa.DATE(),
    #            existing_nullable=True)
    # op.alter_column('articles', 'id',
    #            existing_type=sa.INTEGER(),
    #            server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
    #            existing_nullable=False,
    #            autoincrement=True)
    op.drop_index(op.f('ix_images_path'), table_name='images')
    #op.drop_index(op.f('ix_images_id'), table_name='images')
    op.drop_table('images')

    #op.drop_index(op.f('ix_articles_date'), table_name='articles')
    #op.drop_index(op.f('ix_articles_tag'), table_name='articles')
    op.drop_index(op.f('ix_articles_id'), table_name='articles')
    op.drop_table('articles')

    op.drop_column('users', 'is_admin')
    # ### end Alembic commands ###
