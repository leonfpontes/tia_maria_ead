from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Certificado(Base):
    __tablename__ = "certificados"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    curso_id = Column(UUID(as_uuid=True), ForeignKey("cursos.id"), nullable=False, index=True)
    url_certificado = Column(String(512))
    conquistado_em = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="certificados")
    curso = relationship("Curso", back_populates="certificados")
