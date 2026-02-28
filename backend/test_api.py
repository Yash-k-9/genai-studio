import asyncio
import httpx
from server import app
from fastapi.testclient import TestClient

client = TestClient(app)

def run():
    # Test registration
    print("Testing /register...")
    res = client.post("/register", json={"name": "Test User", "email": "test@example.com", "password": "password123"})
    print("Register Status:", res.status_code)
    print("Register Response:", res.text)

    # Test login
    print("\nTesting /login...")
    res = client.post("/login", json={"email": "test@example.com", "password": "password123"})
    print("Login Status:", res.status_code)
    print("Login Response:", res.text)

if __name__ == "__main__":
    run()
