import os
import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel, create_engine

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/autism_detection",
)

engine = create_engine(DATABASE_URL, echo=False)


class ScreeningRecord(SQLModel, table=True):
    __tablename__ = "screening_records"

    id: Optional[int] = Field(default=None, primary_key=True)
    record_id: str = Field(default_factory=lambda: str(uuid.uuid4()), unique=True, index=True)
    user_id: Optional[str] = Field(default=None, index=True)
    child_age_months: int = Field(..., ge=0)
    gender: str = Field(..., max_length=20)

    qchat_answer_1: int = Field(..., ge=0, le=1)
    qchat_answer_2: int = Field(..., ge=0, le=1)
    qchat_answer_3: int = Field(..., ge=0, le=1)
    qchat_answer_4: int = Field(..., ge=0, le=1)
    qchat_answer_5: int = Field(..., ge=0, le=1)
    qchat_answer_6: int = Field(..., ge=0, le=1)
    qchat_answer_7: int = Field(..., ge=0, le=1)
    qchat_answer_8: int = Field(..., ge=0, le=1)
    qchat_answer_9: int = Field(..., ge=0, le=1)
    qchat_answer_10: int = Field(..., ge=0, le=1)

    total_score: int = Field(..., ge=0, le=10)
    ai_risk_probability: float = Field(..., ge=0.0, le=1.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
