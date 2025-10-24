from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.schemas.user import UserType


class CursoResumo(BaseModel):
    id: UUID
    nome: str
    descricao: str | None = None
    liberado_em: datetime
    expira_em: datetime | None = None
    ativo: bool | None = None


class CertificadoResumo(BaseModel):
    id: UUID
    curso_id: UUID
    curso_nome: str
    url_certificado: str | None = None
    conquistado_em: datetime


class DashboardResponse(BaseModel):
    id: UUID
    nome: str
    email: str
    tipo: UserType
    cursos: List[CursoResumo] = []
    certificados: List[CertificadoResumo] = []
