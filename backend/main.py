import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from datetime import datetime
import shutil

from create_tables import Base, VoiceUpload

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/upload/")
def upload_voice(
    file: UploadFile = File(...),
    description: str = Form(...),
    facility: str = Form(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.mp3'):
        raise HTTPException(status_code=400, detail="Only mp3 files are allowed.")
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    voice_upload = VoiceUpload(
        filename=filename,
        description=description,
        facility=facility
    )
    db.add(voice_upload)
    db.commit()
    db.refresh(voice_upload)
    return {"message": "Upload successful", "id": voice_upload.id}

@app.get("/facilities/")
def get_facilities():
    # List of Kiambu county facilities (sample, can be expanded)
    facilities = [
        "Kiambu Level 5 Hospital",
        "Thika Level 5 Hospital",
        "Gatundu Level 4 Hospital",
        "Ruiru Sub-County Hospital",
        "Tigoni Hospital",
        "Karuri Health Centre",
        "Lari Health Centre",
        "Other"
    ]
    return {"facilities": facilities}
