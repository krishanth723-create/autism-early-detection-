from typing import Literal

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from sqlmodel import Session

from app.database import ScreeningRecord, get_session, init_db
from app.predictor import AutismPredictor

app = FastAPI(
    title="Autism Early Detection API",
    version="0.1.0",
    description="Backend API for autism early detection screening",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = AutismPredictor()


@app.on_event("startup")
def startup_event() -> None:
    init_db()


class ScreeningInput(BaseModel):
    answers: list[int] = Field(..., min_length=10, max_length=10)
    child_age_months: int = Field(default=24, ge=0)
    gender: str = Field(default="male", max_length=20)

    @field_validator("answers")
    @classmethod
    def validate_binary_answers(cls, value: list[int]) -> list[int]:
        if any(answer not in (0, 1) for answer in value):
            raise ValueError("Each answer must be either 0 or 1.")
        return value

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, value: str) -> str:
        normalized_value = value.strip().lower()
        valid_genders = {"male", "female", "other", "prefer_not_to_say"}
        if normalized_value not in valid_genders:
            raise ValueError("Gender must be one of male, female, other, or prefer_not_to_say.")
        return normalized_value


class PredictionResponse(BaseModel):
    probability: float
    risk_level: Literal["low", "high", "moderate"]
    message: str
    total_score: int
    answers: list[int]


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "autism-early-detection-api"}


@app.post("/api/predict", response_model=PredictionResponse)
def predict(
    request: ScreeningInput,
    session: Session = Depends(get_session),
) -> PredictionResponse:
    prediction_result = predictor.predict_risk(
        {
            "qchat_answers": request.answers,
            "age_months": request.child_age_months,
            "gender": request.gender,
            "jaundice_history": False,
        }
    )

    probability_percent = float(prediction_result.get("probability_percent", 0.0))
    risk_level = "high" if probability_percent >= 50 else "low"
    total_score = sum(request.answers)

    screening_record = ScreeningRecord(
        child_age_months=request.child_age_months,
        gender=request.gender,
        qchat_answer_1=request.answers[0],
        qchat_answer_2=request.answers[1],
        qchat_answer_3=request.answers[2],
        qchat_answer_4=request.answers[3],
        qchat_answer_5=request.answers[4],
        qchat_answer_6=request.answers[5],
        qchat_answer_7=request.answers[6],
        qchat_answer_8=request.answers[7],
        qchat_answer_9=request.answers[8],
        qchat_answer_10=request.answers[9],
        total_score=total_score,
        ai_risk_probability=round(probability_percent / 100, 4),
    )
    session.add(screening_record)
    session.commit()
    session.refresh(screening_record)

    return PredictionResponse(
        probability=round(probability_percent, 2),
        risk_level=risk_level,
        message="Screening completed successfully.",
        total_score=total_score,
        answers=request.answers,
    )
