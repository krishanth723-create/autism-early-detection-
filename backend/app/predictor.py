from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier


class AutismPredictor:
    def __init__(self, model_path: str | None = None) -> None:
        self.model_path = model_path or str(Path(__file__).resolve().parent.parent / "saved_models" / "random_forest_model.joblib")
        self.feature_columns = [
            "age_months",
            "jaundice_history",
            "gender",
            "qchat_answer_1",
            "qchat_answer_2",
            "qchat_answer_3",
            "qchat_answer_4",
            "qchat_answer_5",
            "qchat_answer_6",
            "qchat_answer_7",
            "qchat_answer_8",
            "qchat_answer_9",
            "qchat_answer_10",
        ]
        self.gender_map = {"male": 0, "female": 1, "other": 2, "prefer_not_to_say": 3}
        self.model = self._load_or_train_model()

    def _load_or_train_model(self):
        model_file = Path(self.model_path)
        try:
            return joblib.load(model_file)
        except FileNotFoundError:
            model_file.parent.mkdir(parents=True, exist_ok=True)
            X_train = pd.DataFrame(
                [
                    [12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [24, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [36, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [48, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [18, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [30, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                    [16, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                    [40, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
                    [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [60, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                ],
                columns=self.feature_columns,
            )
            y_train = [0, 1, 1, 1, 0, 1, 0, 1, 0, 1]
            model = RandomForestClassifier(n_estimators=50, random_state=42)
            model.fit(X_train, y_train)
            joblib.dump(model, model_file)
            return model

    def predict_risk(self, inputs: Any) -> dict[str, Any]:
        if hasattr(inputs, "model_dump"):
            payload = inputs.model_dump()
        elif isinstance(inputs, dict):
            payload = inputs
        else:
            raise TypeError("inputs must be a dictionary or a Pydantic model instance.")

        answers = payload.get("qchat_answers", [])
        if len(answers) != 10:
            raise ValueError("Exactly 10 Q-CHAT answers are required.")

        feature_row = {
            "age_months": int(payload.get("age_months", 0)),
            "jaundice_history": int(bool(payload.get("jaundice_history", False))),
            "gender": self.gender_map.get(str(payload.get("gender", "prefer_not_to_say")).lower(), 3),
        }

        for index, answer in enumerate(answers, start=1):
            feature_row[f"qchat_answer_{index}"] = int(answer)

        features = pd.DataFrame([feature_row], columns=self.feature_columns)
        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]

        if hasattr(self.model, "classes_"):
            class_index = int((self.model.classes_ == prediction).nonzero()[0][0])
            probability_percent = round(float(probabilities[class_index] * 100), 2)
        else:
            probability_percent = round(float(max(probabilities) * 100), 2)

        if probability_percent >= 70:
            risk_level = "high"
        elif probability_percent >= 40:
            risk_level = "moderate"
        else:
            risk_level = "low"

        return {
            "predicted_class": int(prediction),
            "probability_percent": probability_percent,
            "risk_level": risk_level,
        }
