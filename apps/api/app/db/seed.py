from __future__ import annotations

import uuid

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.certificado import Certificado
from app.models.curso import Curso
from app.models.user import User, UserType
from app.models.user_curso import UserCurso


def seed_initial_data(session: Session) -> None:
    admin_email = "admin@tiamariaead.com"
    aluno_email = "aluno@tiamariaead.com"

    admin = session.query(User).filter(User.email == admin_email).first()
    if not admin:
        admin = User(
            id=uuid.uuid4(),
            nome="Admin Tia Maria",
            email=admin_email,
            senha_hash=get_password_hash("admin123"),
            tipo=UserType.admin,
        )
        session.add(admin)

    aluno = session.query(User).filter(User.email == aluno_email).first()
    if not aluno:
        aluno = User(
            id=uuid.uuid4(),
            nome="Aluno de Exemplo",
            email=aluno_email,
            senha_hash=get_password_hash("aluno123"),
            tipo=UserType.aluno,
        )
        session.add(aluno)

    curso = session.query(Curso).filter(Curso.nome == "Fundamentos da Umbanda").first()
    if not curso:
        curso = Curso(
            id=uuid.uuid4(),
            nome="Fundamentos da Umbanda",
            descricao="Aprenda os princípios essenciais do Terreiro Tia Maria",
        )
        session.add(curso)

    session.flush()

    associacao = (
        session.query(UserCurso)
        .filter(UserCurso.user_id == aluno.id, UserCurso.curso_id == curso.id)
        .first()
    )
    if not associacao:
        session.add(UserCurso(user_id=aluno.id, curso_id=curso.id))

    certificado = (
        session.query(Certificado)
        .filter(Certificado.user_id == aluno.id, Certificado.curso_id == curso.id)
        .first()
    )
    if not certificado:
        session.add(
            Certificado(
                user_id=aluno.id,
                curso_id=curso.id,
                url_certificado="https://example.com/certificados/fundamentos.pdf",
            )
        )

    session.commit()


if __name__ == "__main__":
    with SessionLocal() as session:
        seed_initial_data(session)
        print("Seed concluído: usuários admin/aluno e curso base criados.")
