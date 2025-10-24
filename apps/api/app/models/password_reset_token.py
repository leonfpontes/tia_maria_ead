from __future__ import annotations

import uuid
from datetime import datetime, timedelta

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base

_RESET_TOKEN_TTL = timedelta(hours=2)


def _default_expiration() -> datetime:
    return datetime.utcnow() + _RESET_TOKEN_TTL


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(128), unique=True, nullable=False, index=True)
    criado_em = Column(DateTime, nullable=False, default=datetime.utcnow)
    expira_em = Column(DateTime, nullable=False, default=_default_expiration)
    usado = Column(Boolean, nullable=False, default=False)
    ip_solicitante = Column(String(64))

    user = relationship("User", back_populates="reset_tokens")
