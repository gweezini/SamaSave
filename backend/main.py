import os
import json
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
import vertexai
from vertexai.generative_models import GenerativeModel

# 1. Setup Environment & Logging
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SamaSave-Backend")

# Security: Google Credentials
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(BASE_DIR, "gcp-key.json")

PROJECT_ID = os.getenv("GCP_PROJECT_ID")
LOCATION = os.getenv("GCP_LOCATION")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash") # Fallback strategy for demo stability

# 2. Initialize Vertex AI
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    model = GenerativeModel(MODEL_NAME)
except Exception as e:
    logger.error(f"Failed to initialize Vertex AI: {e}")

app = FastAPI(title="SamaSave AI Engine v1.2")

# 3. CORS - Critical for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Data Model
class TransactionRequest(BaseModel):
    user_name: str
    amount: float
    merchant_category: str
    daily_frequency: int
    goal_progress: float  # 0.0 - 1.0
    current_balance: float
    override_history_24h: int
    transaction_time: str  # Format "HH:MM"

# =========================
# PRECISION SCORING ENGINE
# =========================
def calculate_impulse_score(tx: TransactionRequest):
    score = 0
    try:
        hour = int(tx.transaction_time.split(":")[0])
    except:
        hour = datetime.now().hour

    # 1. Time Risk (The "Midnight Craving" Factor)
    if hour >= 23 or hour <= 5: score += 25
    elif hour >= 22: score += 15

    # 2. Category Risk (Refined Keywords - Removing 'grab' to avoid false positives for transport)
    category = tx.merchant_category.lower()
    impulse_keywords = ["food", "delivery", "fastfood", "shopping", "shopee", "lazada", "gaming", "in-app", "tiktok shop"]
    if any(key in category for key in impulse_keywords):
        score += 20

    # 3. Frequency Risk (Repetitive Behavior)
    if tx.daily_frequency >= 3: score += 25
    elif tx.daily_frequency == 2: score += 15

    # 4. Savings Goal Conflict (Behavioral Goal-Shielding)
    if tx.goal_progress < 0.7: score += 25
    elif tx.goal_progress < 0.9: score += 15

    # 5. Financial Pressure
    if tx.current_balance < 100: score += 20
    elif tx.current_balance < 300: score += 10

    # 6. Discipline Multiplier
    if tx.override_history_24h >= 3: score += 20
    elif tx.override_history_24h == 2: score += 10

    return min(score, 100)

# =========================
# BEHAVIORAL SIN TAX (RESILIENCE TAX)
# =========================
def calculate_sin_tax(amount: float, score: int):
    """
    Behavioral pricing: higher impulsiveness correlates with a higher penalty 
    rate to discourage friction-less spending and encourage reflection.
    """
    if score >= 85: rate = 0.15
    elif score >= 70: rate = 0.10
    else: rate = 0.05
    return round(amount * rate, 2)

# =========================
# SAVAGE AI REASONING (Robust Output)
# =========================
async def get_ai_reason(tx: TransactionRequest, score: int):
    prompt = f"""
    Act as a witty Gen-Z financial mentor for {tx.user_name}.
    Transaction: RM{tx.amount} for {tx.merchant_category} at {tx.transaction_time}.
    Impulse Score: {score}/100. Goal Progress: {int(tx.goal_progress*100)}%.

    Tell them why this is a mistake in ONE short, savage, teasing sentence. 
    No hashtags. Mention their saving progress if score is high.
    """
    try:
        response = model.generate_content(prompt)
        # Ensuring single-line output for UI consistency
        reason = response.text.strip().split("\n")[0]
        return reason if reason else "Budget says no, but your fingers said 'Add to Cart'. Smh."
    except:
        return "Your wallet is currently in a committed relationship with 'Regret'. 🙄"

# =========================
# CORE ENDPOINT
# =========================
@app.post("/api/v1/check-transaction")
async def check_transaction(request: TransactionRequest):
    # Deterministic Decision
    score = calculate_impulse_score(request)
    should_intercept = score >= 75
    
    # Dynamic Risk Assessment
    risk_level = "High" if score >= 75 else "Medium" if score >= 50 else "Low"
    sin_tax = calculate_sin_tax(request.amount, score)
    ai_reason = await get_ai_reason(request, score)

    # Real-time Logging for Audit and Model Tuning
    logger.info(f"[TX_CHECK] User: {request.user_name} | Score: {score} | Category: {request.merchant_category} | Intercepted: {should_intercept}")

    return {
        "impulse_score": score,
        "risk_level": risk_level,
        "reason": ai_reason,
        "should_intercept": should_intercept,
        "suggested_sin_tax": sin_tax,
        "meta": {"model": MODEL_NAME, "status": "processed"}
    }

@app.get("/api/v1/leaderboard")
async def get_leaderboard():
    return [
        {"rank": 1, "name": "Michelle", "score": 98, "reward": "+0.5% p.a."},
        {"rank": 2, "name": "Xinying", "score": 85, "reward": "+0.2% p.a."},
        {"rank": 3, "name": "Zini", "score": 42, "reward": "Penalty Applied"}
    ]

@app.get("/")
def home():
    return {"status": "GX-Squad SamaSave Engine Online", "version": "1.2-stable"}