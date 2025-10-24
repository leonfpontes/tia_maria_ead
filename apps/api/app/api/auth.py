from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import get_db
from app.models.login_log import LoginLog
from app.models.user import User, UserType
from app.schemas.user import UserCreate, UserLogin, UserLoginResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def _request_metadata(request: Request) -> tuple[str | None, str | None]:
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    return client_ip, user_agent


@router.post("/login", response_model=UserLoginResponse)
def login(data: UserLogin, request: Request, db: Session = Depends(get_db)):
    client_ip, user_agent = _request_metadata(request)
    user: User | None = (
        db.query(User)
        .filter(User.email == data.email)
        .filter(User.ativo.is_(True))
        .first()
    )

    if not user or not verify_password(data.senha, user.senha_hash):
        db.add(
            LoginLog(
                user_id=user.id if user else None,
                ip=client_ip,
                agente=user_agent,
                sucesso=False,
            )
        )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )

    token = create_access_token({"sub": str(user.id), "tipo": user.tipo.value})
    db.add(LoginLog(user_id=user.id, ip=client_ip, agente=user_agent, sucesso=True))
    db.commit()

    return UserLoginResponse(
        token=token,
        tipo=user.tipo.value,
        nome=user.nome,
        email=user.email,
    )


@router.post("/register", response_model=UserLoginResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    user = User(
        id=uuid4(),
        nome=data.nome,
        email=data.email,
        senha_hash=get_password_hash(data.senha),
        tipo=UserType(data.tipo),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "tipo": user.tipo.value})
    return UserLoginResponse(
        token=token,
        tipo=user.tipo.value,
        nome=user.nome,
        email=user.email,
    )
