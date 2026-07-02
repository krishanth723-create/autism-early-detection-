from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

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


class ScreeningInput(BaseModel):
    answers: list[int] = Field(..., min_length=10, max_length=10)

    @field_validator("answers")
    @classmethod
    def validate_binary_answers(cls, value: list[int]) -> list[int]:
        if any(answer not in (0, 1) for answer in value):
            raise ValueError("Each answer must be either 0 or 1.")
        return value


class PredictionResponse(BaseModel):
    probability: float
    risk_level: Literal["low", "high"]
    message: str
    total_score: int
    answers: list[int]


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "autism-early-detection-api"}


@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: ScreeningInput) -> PredictionResponse:
    prediction_result = predictor.predict_risk(
        {
            "qchat_answers": request.answers,
            "age_months": 24,
            "gender": "male",
            "jaundice_history": False,
        }
    )

    probability_percent = float(prediction_result.get("probability_percent", 0.0))
    risk_level = "high" if probability_percent >= 50 else "low"

    return PredictionResponse(
        probability=round(probability_percent, 2),
        risk_level=risk_level,
        message="Screening completed successfully.",
        total_score=sum(request.answers),
        answers=request.answers,
    )
