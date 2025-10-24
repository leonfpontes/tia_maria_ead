from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserType


class UserBase(BaseModel):
    nome: str
    email: EmailStr
    tipo: UserType
    ativo: bool = True


class UserCreate(UserBase):
    senha: str = Field(..., min_length=8)


class UserOut(UserBase):
    id: UUID
    criado_em: datetime
    atualizado_em: datetime


class UserLogin(BaseModel):
    email: EmailStr
    senha: str


class UserLoginResponse(BaseModel):
    token: str
    tipo: UserType
    nome: str
    email: EmailStr
