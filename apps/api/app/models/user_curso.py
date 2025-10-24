from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserCurso(Base):
    __tablename__ = "user_cursos"
    __table_args__ = (UniqueConstraint("user_id", "curso_id", name="uq_user_curso"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    curso_id = Column(UUID(as_uuid=True), ForeignKey("cursos.id"), nullable=False, index=True)
    liberado_em = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="cursos")
    curso = relationship("Curso", back_populates="alunos")
