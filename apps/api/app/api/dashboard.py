from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.certificado import Certificado
from app.models.user import User
from app.models.user_curso import UserCurso
from app.schemas.dashboard import CertificadoResumo, CursoResumo, DashboardResponse
from app.schemas.user import UserType

router = APIRouter(prefix="/me", tags=["me"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DashboardResponse:
    user: User | None = (
        db.query(User)
        .options(
            joinedload(User.cursos).joinedload(UserCurso.curso),
            joinedload(User.certificados).joinedload(Certificado.curso),
        )
        .filter(User.id == current_user.id)
        .first()
    )

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    cursos = [
        CursoResumo(
            id=item.curso.id,
            nome=item.curso.nome,
            descricao=item.curso.descricao,
            liberado_em=item.liberado_em,
            expira_em=getattr(item, "expira_em", None),
            ativo=item.curso.ativo,
        )
        for item in user.cursos
        if item.curso is not None
    ]

    certificados = [
        CertificadoResumo(
            id=cert.id,
            curso_id=cert.curso_id,
            curso_nome=cert.curso.nome if cert.curso else "",
            url_certificado=cert.url_certificado,
            conquistado_em=cert.conquistado_em,
        )
        for cert in user.certificados
    ]

    return DashboardResponse(
        id=user.id,
        nome=user.nome,
        email=user.email,
        tipo=UserType(user.tipo.value),
        cursos=cursos,
        certificados=certificados,
    )
