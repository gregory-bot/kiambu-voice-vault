# Kiambu Voice Vault

This project is a full-stack web application for uploading and managing voice recordings for Kiambu County health facilities.

## Project Structure

- **frontend**: Vite + React (in `src/` and root config files)
- **backend**: FastAPI (in `backend/`)

## Features

- Upload audio files (MP3) with facility and description
- Stores files in backend and metadata in PostgreSQL
- Facility selection with custom entry

## Getting Started

### Backend (FastAPI)

1. **Install dependencies**
	- Create a virtual environment and activate it:
	  ```sh
	  cd backend
	  python -m venv venv
	  venv\Scripts\activate  # On Windows
	  source venv/bin/activate  # On Mac/Linux
	  pip install fastapi uvicorn python-dotenv sqlalchemy psycopg2-binary
	  ```
2. **Configure environment**
	- Copy `.env` and set your PostgreSQL credentials.
3. **Run the backend**
	  ```sh
	  uvicorn main:app --reload
	  ```

### Frontend (Vite + React)

1. **Install dependencies**
	```sh
	npm install
	```
2. **Run the frontend**
	```sh
	npm run dev
	```

## Deployment

- Backend can be deployed to [Render](https://render.com/) or any platform supporting FastAPI and PostgreSQL.
- Frontend can be deployed to Vercel, Netlify, or any static host.

## API Endpoints

- `POST /upload/` — Upload audio file
- `GET /facilities/` — List facilities

## License

MIT
