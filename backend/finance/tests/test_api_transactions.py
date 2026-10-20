from datetime import date
from decimal import Decimal

import pytest
from django.test import Client

from finance.models import Category, Transaction


@pytest.fixture
def client():
    return Client()


@pytest.fixture
def income_category(db):
    return Category.objects.create(name="Sueldo", type="income")


@pytest.fixture
def expense_category(db):
    return Category.objects.create(name="Vivienda", type="expense")


def test_health(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_listar_categorias(client, income_category, expense_category):
    response = client.get("/api/categories")

    assert response.status_code == 200

    names = {category["name"] for category in response.json()}
    assert {"Sueldo", "Vivienda"}.issubset(names)


def test_crear_transaccion(client, income_category):
    payload = {
        "description": "Sueldo mensual",
        "amount": "1250000",
        "type": "income",
        "date": "2026-10-20",
        "category_id": income_category.id,
    }

    response = client.post(
        "/api/transactions", payload, content_type="application/json"
    )

    assert response.status_code == 201
    assert response.json()["description"] == "Sueldo mensual"


def test_crear_transaccion_monto_invalido(client, expense_category):
    payload = {
        "description": "Gasto",
        "amount": "0",
        "type": "expense",
        "date": "2026-10-20",
        "category_id": expense_category.id,
    }

    response = client.post(
        "/api/transactions", payload, content_type="application/json"
    )

    assert response.status_code == 422


def test_crear_transaccion_tipo_no_coincide(client, income_category):
    payload = {
        "description": "Gasto con categoría de ingreso",
        "amount": "1000",
        "type": "expense",
        "date": "2026-10-20",
        "category_id": income_category.id,
    }

    response = client.post(
        "/api/transactions", payload, content_type="application/json"
    )

    assert response.status_code == 400


def test_crear_transaccion_categoria_inexistente(client, db):
    payload = {
        "description": "Sin categoría",
        "amount": "1000",
        "type": "expense",
        "date": "2026-10-20",
        "category_id": 99999,
    }

    response = client.post(
        "/api/transactions",
        payload,
        content_type="application/json",
        raise_request_exception=False,
    )

    assert response.status_code == 404


def test_obtener_transaccion(client, income_category):
    transaction = Transaction.objects.create(
        description="Sueldo",
        amount="1000",
        type="income",
        date=date(2026, 10, 20),
        category=income_category,
    )

    response = client.get(f"/api/transactions/{transaction.id}")

    assert response.status_code == 200
    assert response.json()["id"] == transaction.id


def test_obtener_transaccion_inexistente(client, db):
    response = client.get(
        "/api/transactions/99999", raise_request_exception=False
    )

    assert response.status_code == 404


def test_actualizar_transaccion(client, income_category):
    transaction = Transaction.objects.create(
        description="Sueldo",
        amount="1000",
        type="income",
        date=date(2026, 10, 20),
        category=income_category,
    )

    payload = {
        "description": "Sueldo actualizado",
        "amount": "2000",
        "type": "income",
        "date": "2026-10-21",
        "category_id": income_category.id,
    }

    response = client.put(
        f"/api/transactions/{transaction.id}",
        payload,
        content_type="application/json",
    )

    assert response.status_code == 200
    assert response.json()["description"] == "Sueldo actualizado"
    assert Decimal(response.json()["amount"]) == Decimal("2000.00")


def test_eliminar_transaccion(client, income_category):
    transaction = Transaction.objects.create(
        description="Sueldo",
        amount="1000",
        type="income",
        date=date(2026, 10, 20),
        category=income_category,
    )

    response = client.delete(f"/api/transactions/{transaction.id}")

    assert response.status_code == 204
    assert not Transaction.objects.filter(id=transaction.id).exists()
