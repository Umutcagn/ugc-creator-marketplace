import os
import sys
import tempfile
from pathlib import Path

import pytest

# Point the app at a throwaway SQLite file before it is imported
_db_dir = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite:///{Path(_db_dir) / 'test.db'}"
os.environ.setdefault("JWT_SECRET_KEY", "test-secret")
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


def register(client, email, role, password="secret123"):
    res = client.post("/api/auth/register", json={
        "email": email, "password": password, "full_name": email.split("@")[0], "role": role,
    })
    assert res.status_code == 200, res.text
    return {"Authorization": f"Bearer {res.json()['access_token']}"}
