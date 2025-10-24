from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_v1_prefix: str = "/api/v1"
    project_name: str = "Tia Maria EAD API"
    debug: bool = False
    cors_origins: List[str] = Field(default_factory=list, env="CORS_ORIGINS")

    database_url: str = Field(
        default="postgresql+psycopg2://tiamaria:tiamaria@db:5432/tiamariaead",
        env="DATABASE_URL",
        description="SQLAlchemy database URL",
    )
    secret_key: str = Field(default="changeme", env="SECRET_KEY")
    access_token_expire_minutes: int = 60 * 24  # 1 day

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
