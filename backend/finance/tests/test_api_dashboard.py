from datetime import date

import pytest
from django.test import Client

from finance.models import Category, Transaction


@pytest.fixture
def client():
    return Client()


@pytest.fixture
def data(db):
    income = Category.objects.create(name="Sueldo", type="income")
    housing = Category.objects.create(name="Vivienda", type="expense")
    food = Category.objects.create(name="Alimentación", type="expense")

    Transaction.objects.create(
        description="Sueldo oct",
        amount="1250000",
        type="income",
        date=date(2026, 10, 20),
        category=income,
    )
    Transaction.objects.create(
        description="Arriendo oct",
        amount="320000",
        type="expense",
        date=date(2026, 10, 19),
        category=housing,
    )
    Transaction.objects.create(
        description="Supermercado oct",
        amount="68500",
        type="expense",
        date=date(2026, 10, 18),
        category=food,
    )
    Transaction.objects.create(
        description="Sueldo sep",
        amount="1250000",
        type="income",
        date=date(2026, 9, 20),
        category=income,
    )

    return {"income": income, "housing": housing, "food": food}


def test_summary(client, data):
    response = client.get("/api/dashboard/summary")

    assert response.status_code == 200
    body = response.json()

    assert body["total_income"] == "2500000.00"
    assert body["total_expenses"] == "388500.00"
    assert body["net_balance"] == "2111500.00"


def test_summary_filtrado_por_periodo(client, data):
    response = client.get(
        "/api/dashboard/summary?start_date=2026-10-01&end_date=2026-10-31"
    )

    body = response.json()

    assert body["total_income"] == "1250000.00"
    assert body["total_expenses"] == "388500.00"
    assert body["net_balance"] == "861500.00"


def test_summary_sin_datos(client, db):
    response = client.get("/api/dashboard/summary")

    body = response.json()

    assert body["total_income"] == "0"
    assert body["total_expenses"] == "0"


def test_expenses_by_category(client, data):
    response = client.get("/api/dashboard/expenses-by-category")

    assert response.status_code == 200
    body = response.json()

    assert len(body) == 2
    assert body[0]["category_name"] == "Vivienda"
    assert body[0]["total"] == "320000.00"
    assert body[1]["category_name"] == "Alimentación"


def test_monthly_trends(client, data):
    response = client.get("/api/dashboard/monthly-trends")

    assert response.status_code == 200
    body = response.json()

    assert len(body) == 2
    assert body[0]["month"] == "2026-09"
    assert body[0]["income"] == "1250000.00"
    assert body[1]["month"] == "2026-10"
    assert body[1]["expenses"] == "388500.00"
