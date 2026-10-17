from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List, Literal, Optional
from pydantic import BaseModel, Field
import os
import uuid

from app.database import create_db_and_tables, get_session, engine
from app.models import User, BrandProfile, CreatorProfile, Campaign, Application, WalletTransaction
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user

app = FastAPI(
    title="UGC Marketplace API",
    description="E-Ticaret Markaları & Micro-Influencer UGC Pazaryeri API Altyapısı",
    version="1.0.0"
)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_demo_data()

def seed_demo_data():
    with Session(engine) as session:
        # Check if users exist
        existing_user = session.exec(select(User)).first()
        if existing_user:
            return

        # 1. Demo Brand User
        brand_user = User(
            email="marka@trendyolstore.com",
            hashed_password=get_password_hash("123456"),
            full_name="LuxeCosmetics TR",
            role="brand"
        )
        session.add(brand_user)
        session.commit()
        session.refresh(brand_user)

        brand_profile = BrandProfile(
            user_id=brand_user.id,
            company_name="LuxeCosmetics Kozmetik A.Ş.",
            website="https://luxecosmetics.com.tr",
            instagram_handle="@luxecosmetics_tr",
            industry="Kozmetik & Bakım"
        )
        session.add(brand_profile)

        # 2. Demo Creator User
        creator_user = User(
            email="influencer@gmail.com",
            hashed_password=get_password_hash("123456"),
            full_name="Selin Yılmaz",
            role="creator"
        )
        session.add(creator_user)
        session.commit()
        session.refresh(creator_user)

        creator_profile = CreatorProfile(
            user_id=creator_user.id,
            instagram_handle="@selin.style",
            tiktok_handle="@selinyilmaz",
            follower_count=8450,
            engagement_rate=4.8,
            bio="Moda, Güzellik ve Lifestyle içerik üreticisi | 📍 İstanbul",
            categories="Kozmetik, Moda, Lifestyle"
        )
        session.add(creator_profile)

        # 3. Demo Campaigns
        c1 = Campaign(
            brand_id=brand_user.id,
            brand_name="LuxeCosmetics TR",
            title="Cilt Bakım Serumu İnceleme & Deneyim UGC Videosu",
            description="Yeni çıkan Hyaluronic Acid nemlendirici serumumuz için 15-30 saniyelik doğal, reels formatında inceleme videosu hazırlayacak 5 mikro-influencer arıyoruz.",
            product_name="Luxe Hyaluronic Acid Glow Serum 50ml",
            product_url="https://trendyol.com/luxecosmetics/glow-serum-p-102938",
            product_image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
            reward_type="cash_and_gift",
            cash_amount=750.0,
            max_creators=5,
            category="Kozmetik",
            status="active"
        )

        c2 = Campaign(
            brand_id=brand_user.id,
            brand_name="LuxeCosmetics TR",
            title="Yaz Makyajı Rutini Shorts & TikTok İçeriği",
            description="Suya dayanıklı maskara ve mat ruj setimizin canlı renklerini gösteren kreatif TikTok/Reels içerikleri arıyoruz.",
            product_name="Luxe Summer Waterproof Makeup Kit",
            product_url="https://hepsiburada.com/luxecosmetics/summer-kit-p-44812",
            product_image="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
            reward_type="cash_and_gift",
            cash_amount=1200.0,
            max_creators=3,
            category="Kozmetik",
            status="active"
        )

        c3 = Campaign(
            brand_id=brand_user.id,
            brand_name="Nordic Wear TR",
            title="Oversize Sweatshirt Kombin Denedim (Try-On Haul)",
            description="%100 Pamuk yeni sezon oversize unisex sweatshirtlerimiz için kombin deneme videosu çekebilecek stil içerik üreticileri.",
            product_name="Nordic Heavyweight Oversize Hoodie",
            product_url="https://nordicwear.com.tr/hoodie",
            product_image="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80",
            reward_type="cash_and_gift",
            cash_amount=900.0,
            max_creators=8,
            category="Moda",
            status="active"
        )

        session.add_all([c1, c2, c3])
        session.commit()

# --- Pydantic Schemas ---
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: Literal["brand", "creator"]
    handle_or_company: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class CampaignCreateRequest(BaseModel):
    title: str
    description: str
    product_name: str
    product_url: Optional[str] = None
    product_image: Optional[str] = None
    reward_type: str = "cash_and_gift"
    cash_amount: float = Field(default=0.0, ge=0)
    max_creators: int = Field(default=5, ge=1)
    category: str = "Genel"

class ApplicationCreateRequest(BaseModel):
    campaign_id: int

class ApplicationStatusUpdateRequest(BaseModel):
    status: str # 'accepted', 'rejected', 'shipped', 'video_submitted', 'approved'
    cargo_company: Optional[str] = None
    cargo_tracking_code: Optional[str] = None
    video_url: Optional[str] = None
    video_notes: Optional[str] = None

# Allowed application status transitions per actor:
# the campaign's brand reviews and ships, the applying creator submits the video.
BRAND_TRANSITIONS = {
    "pending": {"accepted", "rejected"},
    "accepted": {"shipped"},
    "video_submitted": {"approved"},
}
CREATOR_TRANSITIONS = {
    "accepted": {"video_submitted"},
    "shipped": {"video_submitted"},
}

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": "UGC Marketplace API v1.0 running", "status": "online"}

@app.post("/api/auth/register", response_model=TokenResponse)
def register(req: RegisterRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == req.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu e-posta adresi zaten kayıtlı.")
    
    user = User(
        email=req.email,
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        role=req.role
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    if req.role == "brand":
        profile = BrandProfile(
            user_id=user.id,
            company_name=req.handle_or_company or req.full_name,
            website="",
            instagram_handle=""
        )
        session.add(profile)
    else:
        profile = CreatorProfile(
            user_id=user.id,
            instagram_handle=req.handle_or_company or f"@{req.full_name.lower().replace(' ', '')}",
            follower_count=5000,
            engagement_rate=3.5,
            bio="UGC İçerik Üreticisi"
        )
        session.add(profile)
    session.commit()

    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@app.post("/api/auth/token", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="E-posta veya şifre hatalı.")
    
    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@app.get("/api/auth/me")
def get_me(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    profile_data = {}
    if current_user.role == "brand":
        prof = session.exec(select(BrandProfile).where(BrandProfile.user_id == current_user.id)).first()
        if prof:
            profile_data = prof.dict()
    else:
        prof = session.exec(select(CreatorProfile).where(CreatorProfile.user_id == current_user.id)).first()
        if prof:
            profile_data = prof.dict()

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "profile": profile_data
    }

@app.get("/api/campaigns")
def list_campaigns(category: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Campaign).where(Campaign.status == "active")
    if category and category != "Tümü":
        query = query.where(Campaign.category == category)
    campaigns = session.exec(query).all()
    return campaigns

@app.get("/api/campaigns/{campaign_id}")
def get_campaign(campaign_id: int, session: Session = Depends(get_session)):
    camp = session.exec(select(Campaign).where(Campaign.id == campaign_id)).first()
    if not camp:
        raise HTTPException(status_code=404, detail="Kampanya bulunamadı.")
    return camp

@app.post("/api/campaigns")
def create_campaign(req: CampaignCreateRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "brand":
        raise HTTPException(status_code=403, detail="Sadece markalar kampanya oluşturabilir.")
    
    brand_prof = session.exec(select(BrandProfile).where(BrandProfile.user_id == current_user.id)).first()
    brand_name = brand_prof.company_name if brand_prof else current_user.full_name

    camp = Campaign(
        brand_id=current_user.id,
        brand_name=brand_name,
        title=req.title,
        description=req.description,
        product_name=req.product_name,
        product_url=req.product_url,
        product_image=req.product_image or "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
        reward_type=req.reward_type,
        cash_amount=req.cash_amount,
        max_creators=req.max_creators,
        category=req.category,
        status="active"
    )
    session.add(camp)
    session.commit()
    session.refresh(camp)

    # Lock Escrow Transaction
    escrow_tx = WalletTransaction(
        user_id=current_user.id,
        amount=req.cash_amount * req.max_creators,
        type="escrow_lock",
        description=f"Kampanya Bütçesi Blokesi: {req.title}"
    )
    session.add(escrow_tx)
    session.commit()
    # The second commit expires `camp`; reload it so the response is not an empty object
    session.refresh(camp)

    return camp

@app.post("/api/applications")
def apply_campaign(req: ApplicationCreateRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "creator":
        raise HTTPException(status_code=403, detail="Sadece içerik üreticileri kampanyalara başvurabilir.")
    
    camp = session.exec(select(Campaign).where(Campaign.id == req.campaign_id)).first()
    if not camp:
        raise HTTPException(status_code=404, detail="Kampanya bulunamadı.")
    
    existing = session.exec(
        select(Application).where(Application.campaign_id == req.campaign_id, Application.creator_id == current_user.id)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu kampanyaya zaten başvurdunuz.")
    
    creator_prof = session.exec(select(CreatorProfile).where(CreatorProfile.user_id == current_user.id)).first()
    handle = creator_prof.instagram_handle if creator_prof else "@creator"

    app_entry = Application(
        campaign_id=camp.id,
        creator_id=current_user.id,
        creator_name=current_user.full_name,
        creator_handle=handle,
        status="pending"
    )
    session.add(app_entry)
    session.commit()
    session.refresh(app_entry)
    return app_entry

@app.get("/api/applications/my")
def get_my_applications(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role == "creator":
        apps = session.exec(select(Application).where(Application.creator_id == current_user.id)).all()
    else:
        # For brand: find applications for all campaigns owned by brand
        my_campaign_ids = [c.id for c in session.exec(select(Campaign).where(Campaign.brand_id == current_user.id)).all()]
        apps = session.exec(select(Application).where(Application.campaign_id.in_(my_campaign_ids))).all() if my_campaign_ids else []
    
    # Enrich with campaign info
    result = []
    for a in apps:
        camp = session.exec(select(Campaign).where(Campaign.id == a.campaign_id)).first()
        data = a.dict()
        data["campaign"] = camp.dict() if camp else None
        result.append(data)
    return result

@app.put("/api/applications/{app_id}/status")
def update_application_status(
    app_id: int, 
    req: ApplicationStatusUpdateRequest, 
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    app_entry = session.exec(select(Application).where(Application.id == app_id)).first()
    if not app_entry:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı.")

    camp = session.exec(select(Campaign).where(Campaign.id == app_entry.campaign_id)).first()
    if current_user.role == "brand" and camp and camp.brand_id == current_user.id:
        allowed = BRAND_TRANSITIONS.get(app_entry.status, set())
    elif current_user.role == "creator" and app_entry.creator_id == current_user.id:
        allowed = CREATOR_TRANSITIONS.get(app_entry.status, set())
    else:
        raise HTTPException(status_code=403, detail="Bu başvuru üzerinde yetkiniz yok.")
    if req.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"'{app_entry.status}' durumundan '{req.status}' durumuna geçiş yapılamaz.",
        )

    app_entry.status = req.status
    if req.cargo_company:
        app_entry.cargo_company = req.cargo_company
    if req.cargo_tracking_code:
        app_entry.cargo_tracking_code = req.cargo_tracking_code
    if req.video_url:
        app_entry.video_url = req.video_url
    if req.video_notes:
        app_entry.video_notes = req.video_notes

    session.add(app_entry)
    session.commit()

    # If status is approved, transfer payout to creator
    if req.status == "approved":
        payout_amount = camp.cash_amount if camp else 0.0
        payout = WalletTransaction(
            user_id=app_entry.creator_id,
            amount=payout_amount,
            type="creator_payout",
            description=f"UGC Video Hak Ediş Ödemesi: {camp.title if camp else ''}"
        )
        session.add(payout)
        session.commit()

    return app_entry

@app.post("/api/upload")
async def upload_media(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # Mock Cloudflare R2 / S3 Presigned Direct Upload
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    # In real R2 setup, this returns presigned URL or uploads to R2 bucket
    mock_url = f"https://cdn.ugcmarketplace.tr/videos/{filename}"
    return {
        "url": mock_url,
        "filename": filename,
        "content_type": file.content_type,
        "status": "success"
    }

@app.get("/api/stats")
def get_stats(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role == "brand":
        my_campaigns = session.exec(select(Campaign).where(Campaign.brand_id == current_user.id)).all()
        camp_ids = [c.id for c in my_campaigns]
        apps = session.exec(select(Application).where(Application.campaign_id.in_(camp_ids))).all() if camp_ids else []
        active_count = len([c for c in my_campaigns if c.status == "active"])
        pending_apps = len([a for a in apps if a.status == "pending"])
        approved_videos = len([a for a in apps if a.status == "approved"])
        total_spent = sum([c.cash_amount * c.max_creators for c in my_campaigns])

        return {
            "active_campaigns": active_count,
            "pending_applications": pending_apps,
            "approved_videos": approved_videos,
            "total_budget_locked": total_spent
        }
    else:
        my_apps = session.exec(select(Application).where(Application.creator_id == current_user.id)).all()
        payouts = session.exec(select(WalletTransaction).where(WalletTransaction.user_id == current_user.id, WalletTransaction.type == "creator_payout")).all()
        total_earned = sum([p.amount for p in payouts])

        return {
            "total_applications": len(my_apps),
            "accepted_campaigns": len([a for a in my_apps if a.status in ["accepted", "shipped", "video_submitted", "approved"]]),
            "approved_videos": len([a for a in my_apps if a.status == "approved"]),
            "total_earned_tl": total_earned
        }
