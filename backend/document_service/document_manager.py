"""
Document Management Service - Core functionality for document storage and retrieval.
"""
import os
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

from common.models import DocumentMetadata, DocumentVersion, Permission, AccessLevel


class DocumentManager:
    """Core document management functionality."""
    
    def __init__(self, storage_dir: str):
        """
        Initialize the document manager.
        
        Args:
            storage_dir: Directory where documents will be stored
        """
        self.storage_dir = storage_dir
        os.makedirs(storage_dir, exist_ok=True)
        
        # Create metadata directory
        self.metadata_dir = os.path.join(storage_dir, "metadata")
        os.makedirs(self.metadata_dir, exist_ok=True)
    
    def create_document(self, file_path: str, name: str, owner_id: str, folder_id: Optional[str] = None) -> str:
        """
        Create a new document from a file.
        
        Args:
            file_path: Path to the file to create document from
            name: Name of the document
            owner_id: ID of the document owner
            folder_id: Optional ID of the folder to place the document in
            
        Returns:
            ID of the created document
        """
        # Generate a unique ID for the document
        document_id = str(uuid.uuid4())
        
        # Create document directory
        document_dir = os.path.join(self.storage_dir, document_id)
        os.makedirs(document_dir, exist_ok=True)
        
        # Create versions directory
        versions_dir = os.path.join(document_dir, "versions")
        os.makedirs(versions_dir, exist_ok=True)
        
        # Create initial version
        version_id = str(uuid.uuid4())
        version_path = os.path.join(versions_dir, f"{version_id}.pdf")
        
        # Copy the file to the version path
        with open(file_path, 'rb') as src, open(version_path, 'wb') as dst:
            dst.write(src.read())
        
        # Get file size
        file_size = os.path.getsize(version_path)
        
        # Create document metadata
        from pdf_service.pdf_processor import PDFProcessor
        pdf_info = PDFProcessor.get_pdf_info(version_path)
        
        metadata = {
            "id": document_id,
            "name": name,
            "owner_id": owner_id,
            "folder_id": folder_id,
            "size": file_size,
            "content_type": "application/pdf",
            "storage_key": document_id,
            "is_template": False,
            "metadata": {
                "page_count": pdf_info.get("page_count", 0),
                "has_form": pdf_info.get("has_form", False),
                "is_encrypted": pdf_info.get("is_encrypted", False),
                "author": pdf_info.get("metadata", {}).get("author"),
                "creation_date": pdf_info.get("metadata", {}).get("creation_date"),
                "modification_date": pdf_info.get("metadata", {}).get("modification_date"),
                "keywords": []
            },
            "permissions": [
                {
                    "user_id": owner_id,
                    "access_level": "manage"
                }
            ],
            "versions": [
                {
                    "version_id": version_id,
                    "storage_key": f"{document_id}/versions/{version_id}.pdf",
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": owner_id,
                    "comment": "Initial version"
                }
            ],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Save metadata
        metadata_path = os.path.join(self.metadata_dir, f"{document_id}.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return document_id
    
    def get_document(self, document_id: str) -> Dict[str, Any]:
        """
        Get document metadata.
        
        Args:
            document_id: ID of the document
            
        Returns:
            Document metadata
        """
        metadata_path = os.path.join(self.metadata_dir, f"{document_id}.json")
        if not os.path.exists(metadata_path):
            raise ValueError(f"Document {document_id} not found")
        
        with open(metadata_path, 'r') as f:
            return json.load(f)
    
    def update_document(self, document_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update document metadata.
        
        Args:
            document_id: ID of the document
            updates: Dictionary of updates to apply
            
        Returns:
            Updated document metadata
        """
        metadata = self.get_document(document_id)
        
        # Apply updates
        for key, value in updates.items():
            if key in ["id", "owner_id", "storage_key", "versions", "created_at"]:
                # These fields cannot be updated
                continue
            
            if key == "metadata":
                # Update nested metadata
                for meta_key, meta_value in value.items():
                    metadata["metadata"][meta_key] = meta_value
            else:
                metadata[key] = value
        
        # Update the updated_at timestamp
        metadata["updated_at"] = datetime.utcnow().isoformat()
        
        # Save updated metadata
        metadata_path = os.path.join(self.metadata_dir, f"{document_id}.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return metadata
    
    def delete_document(self, document_id: str) -> bool:
        """
        Delete a document.
        
        Args:
            document_id: ID of the document
            
        Returns:
            True if the document was deleted, False otherwise
        """
        metadata_path = os.path.join(self.metadata_dir, f"{document_id}.json")
        if not os.path.exists(metadata_path):
            raise ValueError(f"Document {document_id} not found")
        
        # Delete metadata file
        os.unlink(metadata_path)
        
        # Delete document directory
        document_dir = os.path.join(self.storage_dir, document_id)
        if os.path.exists(document_dir):
            import shutil
            shutil.rmtree(document_dir)
        
        return True
    
    def list_documents(self, owner_id: Optional[str] = None, folder_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List documents.
        
        Args:
            owner_id: Optional ID of the owner to filter by
            folder_id: Optional ID of the folder to filter by
            
        Returns:
            List of document metadata
        """
        documents = []
        
        for filename in os.listdir(self.metadata_dir):
            if filename.endswith(".json"):
                with open(os.path.join(self.metadata_dir, filename), 'r') as f:
                    metadata = json.load(f)
                
                # Apply filters
                if owner_id and metadata.get("owner_id") != owner_id:
                    continue
                
                if folder_id:
                    if folder_id == "root" and metadata.get("folder_id") is not None:
                        continue
                    elif folder_id != "root" and metadata.get("folder_id") != folder_id:
                        continue
                
                documents.append(metadata)
        
        return documents
    
    def add_document_version(self, document_id: str, file_path: str, user_id: str, comment: Optional[str] = None) -> str:
        """
        Add a new version to a document.
        
        Args:
            document_id: ID of the document
            file_path: Path to the file to add as a new version
            user_id: ID of the user adding the version
            comment: Optional comment about the version
            
        Returns:
            ID of the created version
        """
        metadata = self.get_document(document_id)
        
        # Create version ID
        version_id = str(uuid.uuid4())
        
        # Ensure versions directory exists
        versions_dir = os.path.join(self.storage_dir, document_id, "versions")
        os.makedirs(versions_dir, exist_ok=True)
        
        # Copy the file to the version path
        version_path = os.path.join(versions_dir, f"{version_id}.pdf")
        with open(file_path, 'rb') as src, open(version_path, 'wb') as dst:
            dst.write(src.read())
        
        # Get file size
        file_size = os.path.getsize(version_path)
        
        # Update document metadata
        from pdf_service.pdf_processor import PDFProcessor
        pdf_info = PDFProcessor.get_pdf_info(version_path)
        
        # Create version metadata
        version_metadata = {
            "version_id": version_id,
            "storage_key": f"{document_id}/versions/{version_id}.pdf",
            "created_at": datetime.utcnow().isoformat(),
            "created_by": user_id,
            "comment": comment or "New version"
        }
        
        # Add version to metadata
        metadata["versions"].append(version_metadata)
        
        # Update document metadata
        metadata["size"] = file_size
        metadata["metadata"]["page_count"] = pdf_info.get("page_count", 0)
        metadata["metadata"]["has_form"] = pdf_info.get("has_form", False)
        metadata["metadata"]["is_encrypted"] = pdf_info.get("is_encrypted", False)
        metadata["updated_at"] = datetime.utcnow().isoformat()
        
        # Save updated metadata
        metadata_path = os.path.join(self.metadata_dir, f"{document_id}.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return version_id
    
    def get_document_version(self, document_id: str, version_id: str) -> str:
        """
        Get the file path for a specific document version.
        
        Args:
            document_id: ID of the document
            version_id: ID of the version
            
        Returns:
            Path to the version file
        """
        metadata = self.get_document(document_id)
        
        # Find the version
        version = None
        for v in metadata["versions"]:
            if v["version_id"] == version_id:
                version = v
                break
        
        if not version:
            raise ValueError(f"Version {version_id} not found for document {document_id}")
        
        # Get the version file path
        version_path = os.path.join(self.storage_dir, document_id, "versions", f"{version_id}.pdf")
        if not os.path.exists(version_path):
            raise ValueError(f"Version file not found for version {version_id}")
        
        return version_path
    
    def get_latest_version(self, document_id: str) -> str:
        """
        Get the file path for the latest version of a document.
        
        Args:
            document_id: ID of the document
            
        Returns:
            Path to the latest version file
        """
        metadata = self.get_document(document_id)
        
        if not metadata["versions"]:
            raise ValueError(f"No versions found for document {document_id}")
        
        # Get the latest version
        latest_version = metadata["versions"][-1]
        
        # Get the version file path
        version_path = os.path.join(self.storage_dir, document_id, "versions", f"{latest_version['version_id']}.pdf")
        if not os.path.exists(version_path):
            raise ValueError(f"Version file not found for latest version")
        
        return version_path
    
    def update_permissions(self, document_id: str, permissions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Update document permissions.
        
        Args:
            document_id: ID of the document
            permissions: List of permission objects
            
        Returns:
            Updated document metadata
        """
        metadata = self.get_document(document_id)
        
        # Update permissions
        metadata["permissions"] = permissions
        
        # Update the updated_at timestamp
        metadata["updated_at"] = datetime.utcnow().isoformat()
        
        # Save updated metadata
        metadata_path = os.path.join(self.metadata_dir, f"{document_id}.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return metadata
    
    def check_permission(self, document_id: str, user_id: str, required_level: AccessLevel) -> bool:
        """
        Check if a user has the required permission level for a document.
        
        Args:
            document_id: ID of the document
            user_id: ID of the user
            required_level: Required access level
            
        Returns:
            True if the user has the required permission, False otherwise
        """
        metadata = self.get_document(document_id)
        
        # Check if user is the owner
        if metadata["owner_id"] == user_id:
            return True
        
        # Check permissions
        for permission in metadata["permissions"]:
            if permission["user_id"] == user_id:
                user_level = AccessLevel(permission["access_level"])
                
                # Check if user has required level
                if required_level == AccessLevel.VIEW and user_level in [AccessLevel.VIEW, AccessLevel.COMMENT, AccessLevel.EDIT, AccessLevel.MANAGE]:
                    return True
                elif required_level == AccessLevel.COMMENT and user_level in [AccessLevel.COMMENT, AccessLevel.EDIT, AccessLevel.MANAGE]:
                    return True
                elif required_level == AccessLevel.EDIT and user_level in [AccessLevel.EDIT, AccessLevel.MANAGE]:
                    return True
                elif required_level == AccessLevel.MANAGE and user_level == AccessLevel.MANAGE:
                    return True
        
        return False
