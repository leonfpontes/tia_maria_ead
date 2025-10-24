from functools import lru_cache
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    api_v1_prefix: str = "/api/v1"
    project_name: str = "Tia Maria EAD API"
    debug: bool = False

    database_url: str = Field(
        ..., env="DATABASE_URL", description="SQLAlchemy database URL"
    )
    secret_key: str = Field(..., env="SECRET_KEY")
    access_token_expire_minutes: int = 60 * 24  # 1 day

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
