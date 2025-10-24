from __future__ import annotations

import secrets
from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.email import send_password_reset_email
from app.core.security import get_password_hash
from app.db.session import get_db
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.schemas.auth import MessageResponse, PasswordResetConfirm, PasswordResetRequest

router = APIRouter(prefix="/auth", tags=["auth"])

RESET_MESSAGE = "Se o e-mail estiver cadastrado, enviaremos as instruções em instantes."


@router.post("/request-password-reset", response_model=MessageResponse, status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(
    payload: PasswordResetRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> MessageResponse:
    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .filter(User.ativo.is_(True))
        .first()
    )

    if not user:
        return MessageResponse(message=RESET_MESSAGE)

    token = secrets.token_urlsafe(32)
    reset_token = PasswordResetToken(
        id=uuid4(),
        user_id=user.id,
        token=token,
        ip_solicitante=request.client.host if request.client else None,
    )

    db.add(reset_token)
    db.commit()

    send_password_reset_email(user.email, token)
    return MessageResponse(message=RESET_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: PasswordResetConfirm, db: Session = Depends(get_db)) -> MessageResponse:
    reset_token = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token == payload.token)
        .filter(PasswordResetToken.usado.is_(False))
        .filter(PasswordResetToken.expira_em > datetime.utcnow())
        .first()
    )

    if not reset_token:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    user.senha_hash = get_password_hash(payload.nova_senha)
    reset_token.usado = True
    db.commit()

    return MessageResponse(message="Senha redefinida com sucesso")
