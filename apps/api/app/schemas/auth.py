from pydantic import BaseModel, EmailStr, Field


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str = Field(..., min_length=16)
    nova_senha: str = Field(..., min_length=8)


class MessageResponse(BaseModel):
    message: str
