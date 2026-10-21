from datetime import date
from decimal import Decimal

import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from finance.models import Category, Transaction


def test_crea_transacciones_en_el_mes_solicitado(db):
    call_command("seed_transactions", "--month", "2026-10", "--seed", "7")

    transactions = Transaction.objects.all()

    assert transactions.exists()
    assert transactions.filter(date__year=2026, date__month=10).count() == len(
        transactions
    )


def test_incluye_ingresos_y_gastos(db):
    call_command("seed_transactions", "--month", "2026-10", "--seed", "7")

    assert Transaction.objects.filter(type="income").exists()
    assert Transaction.objects.filter(type="expense").exists()


def test_categoria_coincide_con_el_tipo(db):
    call_command("seed_transactions", "--month", "2026-10", "--seed", "7")

    for transaction in Transaction.objects.all():
        assert transaction.category.type == transaction.type


def test_montos_son_positivos(db):
    call_command("seed_transactions", "--month", "2026-10", "--seed", "7")

    assert all(
        transaction.amount > Decimal("0")
        for transaction in Transaction.objects.all()
    )


def test_reset_reemplaza_las_transacciones_del_mes(db):
    category = Category.objects.get(name="Sueldo")

    Transaction.objects.create(
        description="Transacción previa",
        amount=Decimal("1000"),
        type="income",
        date=date(2026, 10, 3),
        category=category,
    )

    call_command("seed_transactions", "--month", "2026-10", "--seed", "7")
    created = Transaction.objects.count()

    call_command("seed_transactions", "--month", "2026-10", "--seed", "7", "--reset")

    assert Transaction.objects.count() == created - 1
    assert not Transaction.objects.filter(description="Transacción previa").exists()


def test_no_toca_transacciones_de_otros_meses(db):
    category = Category.objects.get(name="Sueldo")

    Transaction.objects.create(
        description="Septiembre",
        amount=Decimal("1000"),
        type="income",
        date=date(2026, 9, 3),
        category=category,
    )

    call_command("seed_transactions", "--month", "2026-10", "--seed", "7", "--reset")

    assert Transaction.objects.filter(description="Septiembre").exists()


def test_es_determinista(db):
    call_command("seed_transactions", "--month", "2026-10", "--seed", "7")
    first = list(
        Transaction.objects.order_by("date", "description").values_list(
            "description", "amount", "date"
        )
    )

    call_command("seed_transactions", "--month", "2026-10", "--seed", "7", "--reset")
    second = list(
        Transaction.objects.order_by("date", "description").values_list(
            "description", "amount", "date"
        )
    )

    assert first == second


def test_no_crea_transacciones_futuras_en_el_mes_actual(db):
    today = date.today()

    call_command("seed_transactions", "--seed", "7")

    assert not Transaction.objects.filter(date__gt=today).exists()


def test_mes_invalido_falla(db):
    with pytest.raises(CommandError):
        call_command("seed_transactions", "--month", "2026-13")


def test_formato_invalido_falla(db):
    with pytest.raises(CommandError):
        call_command("seed_transactions", "--month", "octubre")


def test_requiere_categorias(db):
    Category.objects.all().delete()

    with pytest.raises(CommandError):
        call_command("seed_transactions", "--month", "2026-10")
