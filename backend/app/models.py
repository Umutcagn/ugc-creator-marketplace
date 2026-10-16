from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    role: str = Field(default="creator") # 'brand', 'creator', 'admin'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BrandProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    company_name: str
    website: Optional[str] = None
    instagram_handle: Optional[str] = None
    logo_url: Optional[str] = None
    industry: Optional[str] = None

class CreatorProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    instagram_handle: Optional[str] = None
    tiktok_handle: Optional[str] = None
    follower_count: int = Field(default=0)
    engagement_rate: float = Field(default=0.0)
    bio: Optional[str] = None
    categories: Optional[str] = None # JSON string or comma-separated: "Moda, Kozmetik"

class Campaign(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_id: int = Field(foreign_key="user.id")
    brand_name: str
    title: str
    description: str
    product_name: str
    product_url: Optional[str] = None
    product_image: Optional[str] = None
    reward_type: str = Field(default="cash_and_gift") # 'gift_only', 'cash_only', 'cash_and_gift'
    cash_amount: float = Field(default=0.0)
    max_creators: int = Field(default=10)
    category: str = Field(default="Genel")
    status: str = Field(default="active") # 'draft', 'active', 'completed'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    campaign_id: int = Field(foreign_key="campaign.id")
    creator_id: int = Field(foreign_key="user.id")
    creator_name: str
    creator_handle: Optional[str] = None
    status: str = Field(default="pending") # 'pending', 'accepted', 'rejected', 'shipped', 'video_submitted', 'approved'
    cargo_company: Optional[str] = None
    cargo_tracking_code: Optional[str] = None
    video_url: Optional[str] = None
    video_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WalletTransaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    amount: float
    type: str # 'escrow_lock', 'creator_payout', 'refund'
    description: str
    status: str = Field(default="completed")
    created_at: datetime = Field(default_factory=datetime.utcnow)
