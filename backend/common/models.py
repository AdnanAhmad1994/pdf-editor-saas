"""
Common utilities and base models for the PDF Editor SaaS application.
"""
from datetime import datetime
import uuid
from typing import List, Optional, Dict, Any, Union
from enum import Enum

from pydantic import BaseModel, Field


class AccessLevel(str, Enum):
    """Access level for document and folder permissions."""
    VIEW = "view"
    COMMENT = "comment"
    EDIT = "edit"
    MANAGE = "manage"


class UserRole(str, Enum):
    """User roles in the system."""
    ADMIN = "admin"
    USER = "user"


class SubscriptionTier(str, Enum):
    """Subscription tiers available."""
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class Permission(BaseModel):
    """Permission model for documents and folders."""
    user_id: str = Field(..., description="ID of the user granted permission")
    access_level: AccessLevel = Field(..., description="Level of access granted")


class DocumentMetadata(BaseModel):
    """Metadata for PDF documents."""
    page_count: int = Field(0, description="Number of pages in the document")
    has_form: bool = Field(False, description="Whether the document contains form fields")
    is_encrypted: bool = Field(False, description="Whether the document is encrypted")
    author: Optional[str] = Field(None, description="Author of the document")
    creation_date: Optional[datetime] = Field(None, description="Date the document was created")
    modification_date: Optional[datetime] = Field(None, description="Date the document was last modified")
    keywords: List[str] = Field(default_factory=list, description="Keywords associated with the document")


class DocumentVersion(BaseModel):
    """Version information for a document."""
    version_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique identifier for this version")
    storage_key: str = Field(..., description="Storage key for the document version")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="When this version was created")
    created_by: str = Field(..., description="ID of the user who created this version")
    comment: Optional[str] = Field(None, description="Comment about this version")


class APIResponse(BaseModel):
    """Standard API response format."""
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Message describing the result")
    data: Optional[Any] = Field(None, description="Response data if any")
    errors: Optional[List[Dict[str, Any]]] = Field(None, description="Errors if any")


class PaginatedResponse(BaseModel):
    """Paginated response format."""
    items: List[Any] = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    size: int = Field(..., description="Number of items per page")
    pages: int = Field(..., description="Total number of pages")
