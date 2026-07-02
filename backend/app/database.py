from datetime import datetime
from pathlib import Path
from typing import Generator, Optional
import uuid

from sqlmodel import Field, SQLModel, Session, create_engine

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = BASE_DIR / "autism_screening.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

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


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
