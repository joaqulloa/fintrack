from datetime import date
from decimal import Decimal

import pytest
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

from finance.models import Category, Transaction


@pytest.fixture
def income_category(db):
    return Category.objects.create(name="Sueldo", type="income")


@pytest.fixture
def expense_category(db):
    return Category.objects.create(name="Vivienda", type="expense")


def test_crear_categoria(income_category):
    assert income_category.name == "Sueldo"
    assert income_category.type == "income"
    assert income_category.created_at is not None


def test_crear_transaccion(income_category):
    transaction = Transaction.objects.create(
        description="Sueldo mensual",
        amount=Decimal("1250000.00"),
        type="income",
        date=date(2026, 10, 20),
        category=income_category,
    )

    assert transaction.amount == Decimal("1250000.00")
    assert transaction.category_id == income_category.id


def test_amount_debe_ser_positivo(income_category):
    with pytest.raises(IntegrityError):
        Transaction.objects.create(
            description="Negativo",
            amount=Decimal("-100"),
            type="income",
            date=date(2026, 10, 20),
            category=income_category,
        )


def test_amount_cero_no_permitido(income_category):
    with pytest.raises(IntegrityError):
        Transaction.objects.create(
            description="Cero",
            amount=Decimal("0"),
            type="income",
            date=date(2026, 10, 20),
            category=income_category,
        )


def test_tipo_categoria_debe_coincidir(income_category):
    transaction = Transaction(
        description="Gasto con categoría de ingreso",
        amount=Decimal("1000"),
        type="expense",
        date=date(2026, 10, 20),
        category=income_category,
    )

    with pytest.raises(ValidationError):
        transaction.full_clean()


def test_no_borrar_categoria_referenciada(income_category):
    Transaction.objects.create(
        description="Sueldo",
        amount=Decimal("1000"),
        type="income",
        date=date(2026, 10, 20),
        category=income_category,
    )

    with pytest.raises(Exception):
        income_category.delete()


def test_orden_por_fecha_descendente(income_category):
    Transaction.objects.create(
        description="Vieja",
        amount=Decimal("100"),
        type="income",
        date=date(2026, 1, 1),
        category=income_category,
    )
    Transaction.objects.create(
        description="Nueva",
        amount=Decimal("100"),
        type="income",
        date=date(2026, 12, 1),
        category=income_category,
    )

    assert list(Transaction.objects.values_list("description", flat=True)) == [
        "Nueva",
        "Vieja",
    ]
