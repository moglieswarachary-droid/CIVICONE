from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CivicOne Backend (Python/FastAPI)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CivicOne API Backend"}

from .routers import auth_routes

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
