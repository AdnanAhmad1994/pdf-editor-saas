"""
Main application entry point for the PDF Editor SaaS backend.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from pdf_service.routes import router as pdf_router

# Create FastAPI app
app = FastAPI(
    title="PDF Editor SaaS API",
    description="Backend API for PDF Editor SaaS application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(pdf_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to PDF Editor SaaS API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": exc.detail, "errors": [{"detail": exc.detail}]}
        )
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error", "errors": [{"detail": str(exc)}]}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
