import itertools

import pytest

from conftest import register

_ids = itertools.count()


@pytest.fixture
def flow(client):
    """A brand with one campaign and a creator who applied to it."""
    n = next(_ids)
    brand = register(client, f"brand{n}@test.com", "brand")
    creator = register(client, f"creator{n}@test.com", "creator")
    camp = client.post("/api/campaigns", headers=brand, json={
        "title": "Test", "description": "d", "product_name": "p", "cash_amount": 500.0, "max_creators": 2,
    })
    assert camp.status_code == 200, camp.text
    app_res = client.post("/api/applications", headers=creator, json={"campaign_id": camp.json()["id"]})
    assert app_res.status_code == 200, app_res.text
    return brand, creator, app_res.json()["id"]


def set_status(client, headers, app_id, status, **extra):
    return client.put(f"/api/applications/{app_id}/status", headers=headers, json={"status": status, **extra})


def test_login_with_registered_credentials(client):
    register(client, "login@test.com", "creator", password="pw-123456")
    ok = client.post("/api/auth/token", data={"username": "login@test.com", "password": "pw-123456"})
    bad = client.post("/api/auth/token", data={"username": "login@test.com", "password": "wrong"})
    assert ok.status_code == 200 and ok.json()["user"]["role"] == "creator"
    assert bad.status_code == 400


def test_register_rejects_unknown_role(client):
    res = client.post("/api/auth/register", json={
        "email": "admin@test.com", "password": "x", "full_name": "x", "role": "admin",
    })
    assert res.status_code == 422


def test_protected_endpoints_require_token(client):
    assert client.get("/api/auth/me").status_code == 401
    assert client.post("/api/upload", files={"file": ("a.mp4", b"x")}).status_code == 401


def test_only_brands_create_campaigns_with_valid_budget(client):
    creator = register(client, "c-campaign@test.com", "creator")
    brand = register(client, "b-campaign@test.com", "brand")
    body = {"title": "t", "description": "d", "product_name": "p", "cash_amount": 100.0, "max_creators": 1}
    assert client.post("/api/campaigns", headers=creator, json=body).status_code == 403
    assert client.post("/api/campaigns", headers=brand, json={**body, "cash_amount": -5}).status_code == 422
    assert client.post("/api/campaigns", headers=brand, json={**body, "max_creators": 0}).status_code == 422


def test_creator_cannot_apply_twice(client, flow):
    _, creator, _ = flow
    campaign_id = client.get("/api/applications/my", headers=creator).json()[0]["campaign_id"]
    again = client.post("/api/applications", headers=creator, json={"campaign_id": campaign_id})
    assert again.status_code == 400


def test_creator_cannot_approve_own_application(client, flow):
    _, creator, app_id = flow
    assert set_status(client, creator, app_id, "approved").status_code == 400
    assert client.get("/api/stats", headers=creator).json()["total_earned_tl"] == 0


def test_other_brand_cannot_touch_application(client, flow):
    _, _, app_id = flow
    intruder = register(client, f"intruder{next(_ids)}@test.com", "brand")
    assert set_status(client, intruder, app_id, "accepted").status_code == 403


def test_full_happy_path_pays_creator_exactly_once(client, flow):
    brand, creator, app_id = flow
    assert set_status(client, brand, app_id, "accepted").status_code == 200
    assert set_status(client, brand, app_id, "shipped", cargo_company="Yurtici", cargo_tracking_code="123").status_code == 200
    assert set_status(client, creator, app_id, "video_submitted", video_url="https://x/v.mp4").status_code == 200
    assert set_status(client, brand, app_id, "approved").status_code == 200

    # Repeating the approval must not create a second payout
    assert set_status(client, brand, app_id, "approved").status_code == 400
    assert client.get("/api/stats", headers=creator).json()["total_earned_tl"] == 500.0


def test_brand_cannot_skip_review_steps(client, flow):
    brand, _, app_id = flow
    assert set_status(client, brand, app_id, "approved").status_code == 400
    assert set_status(client, brand, app_id, "shipped").status_code == 400
