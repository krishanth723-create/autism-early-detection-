import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. மாதிரி தரவுகளை உருவாக்குதல் (Generate Mock Dataset)
print("Generating dataset...")
np.random.seed(42)
X_mock = np.random.randint(0, 2, size=(1000, 10)) # 10 Q-CHAT கேள்விகள்
y_mock = (X_mock.sum(axis=1) >= 5).astype(int) 

# 2. மாடலைப் பயிற்றுவித்தல் (Train Random Forest)
print("Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_mock, y_mock)

# 3. மாடலைச்சேமித்தல் (Save Model Artifact)
os.makedirs("saved_models", exist_ok=True)
model_path = "saved_models/autism_model.joblib"
joblib.dump(model, model_path)

print(f"Success! Model trained and saved at: {model_path}")
