from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

Base = declarative_base()

class VoiceUpload(Base):
    __tablename__ = 'voice_uploads'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    description = Column(String, nullable=False)
    facility = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
