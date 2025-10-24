"""create auth tables

Revision ID: b97e6b275545
Revises: 
Create Date: 2025-10-24 03:58:41.309310
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "b97e6b275545"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    user_type_enum = postgresql.ENUM("admin", "aluno", name="user_type")
    user_type_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("nome", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("senha_hash", sa.String(length=255), nullable=False),
        sa.Column("tipo", sa.Enum(name="user_type", native_enum=False), nullable=False),
        sa.Column("ativo", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("criado_em", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column(
            "atualizado_em",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=False)

    op.create_table(
        "cursos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("nome", sa.String(length=255), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=True),
        sa.Column("ativo", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("criado_em", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "login_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("ip", sa.String(length=64), nullable=True),
        sa.Column("agente", sa.String(length=255), nullable=True),
        sa.Column("sucesso", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("criado_em", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_login_logs_user_id", "login_logs", ["user_id"], unique=False)

    op.create_table(
        "password_reset_tokens",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("token", sa.String(length=128), nullable=False),
        sa.Column("criado_em", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("expira_em", sa.DateTime(), nullable=False),
        sa.Column("usado", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("ip_solicitante", sa.String(length=64), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("token", name="uq_password_reset_tokens_token"),
    )
    op.create_index("ix_password_reset_tokens_user_id", "password_reset_tokens", ["user_id"], unique=False)

    op.create_table(
        "user_cursos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("curso_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("liberado_em", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["curso_id"], ["cursos.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "curso_id", name="uq_user_curso"),
    )
    op.create_index("ix_user_cursos_user_id", "user_cursos", ["user_id"], unique=False)
    op.create_index("ix_user_cursos_curso_id", "user_cursos", ["curso_id"], unique=False)

    op.create_table(
        "certificados",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("curso_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("url_certificado", sa.String(length=512), nullable=True),
        sa.Column("conquistado_em", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["curso_id"], ["cursos.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_certificados_user_id", "certificados", ["user_id"], unique=False)
    op.create_index("ix_certificados_curso_id", "certificados", ["curso_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_certificados_curso_id", table_name="certificados")
    op.drop_index("ix_certificados_user_id", table_name="certificados")
    op.drop_table("certificados")

    op.drop_index("ix_user_cursos_curso_id", table_name="user_cursos")
    op.drop_index("ix_user_cursos_user_id", table_name="user_cursos")
    op.drop_table("user_cursos")

    op.drop_index("ix_password_reset_tokens_user_id", table_name="password_reset_tokens")
    op.drop_table("password_reset_tokens")

    op.drop_index("ix_login_logs_user_id", table_name="login_logs")
    op.drop_table("login_logs")

    op.drop_table("cursos")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    op.execute("DROP TYPE user_type")
