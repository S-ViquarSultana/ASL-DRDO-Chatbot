from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import matplotlib.pyplot as plt
import numpy as np
import base64
import io

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy in-memory store
stored_dummy_data = list(np.random.rand(50) * 100)  # pretend this came from CSV

class AnalyzeRequest(BaseModel):
    data: list[float]
    type: str

@app.post("/upload-data")
async def upload_data(file: UploadFile = File(...)):
    # Just pretend we parsed it
    return {
        "success": True,
        "data": stored_dummy_data,
        "message": f"Received file: {file.filename} (Parsed 50 rows)"
    }

@app.get("/analysis-options")
def get_analysis_options():
    return {
        "options": ["lasso_regression", "peaks", "amplitude", "distribution"]
    }

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    analysis_type = req.type
    data = req.data

    # Hardcoded fake results
    fake_result = {}
    if analysis_type == "lasso_regression":
        fake_result = {
            "coefficients": [0.5, -0.1, 0.2],
            "intercept": 70.3,
            "predictions": [np.mean(data) + np.random.randn() for _ in data],
            "r2_score": 0.82,
            "mse": 14.5,
            "report": "Lasso regression completed. R² = 0.82, MSE = 14.5"
        }
    elif analysis_type == "peaks":
        peaks = [i for i in range(1, len(data)-1) if data[i] > data[i-1] and data[i] > data[i+1]]
        valleys = [i for i in range(1, len(data)-1) if data[i] < data[i-1] and data[i] < data[i+1]]
        fake_result = {
            "peaks": peaks,
            "valleys": valleys,
            "report": f"Found {len(peaks)} peaks and {len(valleys)} valleys"
        }
    elif analysis_type == "amplitude":
        amplitude = max(data) - min(data)
        fake_result = {
            "amplitude": amplitude,
            "max": max(data),
            "min": min(data),
            "report": f"Amplitude: {amplitude:.2f}"
        }
    elif analysis_type == "distribution":
        mean = np.mean(data)
        std = np.std(data)
        fake_result = {
            "mean": mean,
            "std": std,
            "report": f"Mean: {mean:.2f}, Std Dev: {std:.2f}"
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid analysis type")

    # Generate fake plot
    plot = create_plot(data, analysis_type)

    return {
        "success": True,
        "results": fake_result,
        "plot_base64": plot
    }

def create_plot(data, analysis_type):
    fig, ax = plt.subplots()
    x = np.arange(len(data))
    ax.plot(x, data, label="Uploaded Data")

    if analysis_type == "lasso_regression":
        ax.plot(x, [np.mean(data) for _ in x], label="Fake Regression Line", color="red")
    elif analysis_type == "peaks":
        ax.plot(x, data, label="Signal")
    elif analysis_type == "distribution":
        ax.hist(data, bins=10, alpha=0.6)
    elif analysis_type == "amplitude":
        ax.plot(x, data, label="Waveform")

    ax.set_title(analysis_type.replace("_", " ").title())
    ax.legend()
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')
