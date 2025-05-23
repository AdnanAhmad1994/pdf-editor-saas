"""
FastAPI routes for the Document Management Service.
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks, Query
from fastapi.responses import FileResponse
import os
import tempfile
import uuid
import shutil
from typing import List, Dict, Any, Optional
import json

from document_service.document_manager import DocumentManager
from common.models import APIResponse, AccessLevel

router = APIRouter(prefix="/api/documents", tags=["Document Management"])

# Initialize document manager
STORAGE_DIR = os.path.join(tempfile.gettempdir(), "pdf_editor_storage")
document_manager = DocumentManager(STORAGE_DIR)

# Temporary storage for uploaded files
TEMP_DIR = os.path.join(tempfile.gettempdir(), "pdf_editor")
os.makedirs(TEMP_DIR, exist_ok=True)


def save_upload_file_temp(upload_file: UploadFile) -> str:
    """Save an upload file to a temporary location."""
    try:
        # Create a unique filename
        filename = f"{uuid.uuid4()}_{upload_file.filename}"
        temp_file = os.path.join(TEMP_DIR, filename)
        
        # Save the file
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
            
        return temp_file
    finally:
        upload_file.file.close()


@router.post("", response_model=APIResponse)
async def create_document(
    file: UploadFile = File(...),
    name: str = Form(...),
    owner_id: str = Form(...),
    folder_id: Optional[str] = Form(None)
):
    """
    Create a new document from an uploaded file.
    """
    try:
        temp_file = save_upload_file_temp(file)
        
        # Create document
        document_id = document_manager.create_document(temp_file, name, owner_id, folder_id)
        
        # Clean up the temporary file
        os.unlink(temp_file)
        
        # Get the created document
        document = document_manager.get_document(document_id)
        
        return APIResponse(
            success=True,
            message="Document created successfully",
            data=document
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error creating document: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.get("", response_model=APIResponse)
async def list_documents(
    owner_id: Optional[str] = Query(None),
    folder_id: Optional[str] = Query(None)
):
    """
    List documents, optionally filtered by owner or folder.
    """
    try:
        documents = document_manager.list_documents(owner_id, folder_id)
        
        return APIResponse(
            success=True,
            message="Documents retrieved successfully",
            data=documents
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error listing documents: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.get("/{document_id}", response_model=APIResponse)
async def get_document(document_id: str):
    """
    Get document metadata by ID.
    """
    try:
        document = document_manager.get_document(document_id)
        
        return APIResponse(
            success=True,
            message="Document retrieved successfully",
            data=document
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error retrieving document: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.put("/{document_id}", response_model=APIResponse)
async def update_document(
    document_id: str,
    updates: Dict[str, Any]
):
    """
    Update document metadata.
    """
    try:
        updated_document = document_manager.update_document(document_id, updates)
        
        return APIResponse(
            success=True,
            message="Document updated successfully",
            data=updated_document
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error updating document: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.delete("/{document_id}", response_model=APIResponse)
async def delete_document(document_id: str):
    """
    Delete a document.
    """
    try:
        document_manager.delete_document(document_id)
        
        return APIResponse(
            success=True,
            message="Document deleted successfully"
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error deleting document: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.get("/{document_id}/download", response_model=None)
async def download_document(
    background_tasks: BackgroundTasks,
    document_id: str,
    version_id: Optional[str] = Query(None)
):
    """
    Download a document, optionally specifying a version.
    """
    try:
        # Get document metadata
        document = document_manager.get_document(document_id)
        
        # Get the file path
        if version_id:
            file_path = document_manager.get_document_version(document_id, version_id)
        else:
            file_path = document_manager.get_latest_version(document_id)
        
        return FileResponse(
            file_path,
            filename=f"{document['name']}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error downloading document: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.post("/{document_id}/versions", response_model=APIResponse)
async def add_document_version(
    document_id: str,
    file: UploadFile = File(...),
    user_id: str = Form(...),
    comment: Optional[str] = Form(None)
):
    """
    Add a new version to a document.
    """
    try:
        temp_file = save_upload_file_temp(file)
        
        # Add version
        version_id = document_manager.add_document_version(document_id, temp_file, user_id, comment)
        
        # Clean up the temporary file
        os.unlink(temp_file)
        
        # Get the updated document
        document = document_manager.get_document(document_id)
        
        return APIResponse(
            success=True,
            message="Document version added successfully",
            data={
                "document": document,
                "version_id": version_id
            }
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error adding document version: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.get("/{document_id}/versions", response_model=APIResponse)
async def list_document_versions(document_id: str):
    """
    List all versions of a document.
    """
    try:
        document = document_manager.get_document(document_id)
        
        return APIResponse(
            success=True,
            message="Document versions retrieved successfully",
            data=document["versions"]
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error listing document versions: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.put("/{document_id}/permissions", response_model=APIResponse)
async def update_document_permissions(
    document_id: str,
    permissions: List[Dict[str, Any]]
):
    """
    Update document permissions.
    """
    try:
        updated_document = document_manager.update_permissions(document_id, permissions)
        
        return APIResponse(
            success=True,
            message="Document permissions updated successfully",
            data=updated_document
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error updating document permissions: {str(e)}",
            errors=[{"detail": str(e)}]
        )


@router.get("/{document_id}/permissions", response_model=APIResponse)
async def get_document_permissions(document_id: str):
    """
    Get document permissions.
    """
    try:
        document = document_manager.get_document(document_id)
        
        return APIResponse(
            success=True,
            message="Document permissions retrieved successfully",
            data=document["permissions"]
        )
    except Exception as e:
        return APIResponse(
            success=False,
            message=f"Error retrieving document permissions: {str(e)}",
            errors=[{"detail": str(e)}]
        )
