import random
from calendar import monthrange
from datetime import date
from decimal import Decimal

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction as db_transaction

from finance.models import Category, Transaction

TEMPLATES = [
    {
        "category": "Sueldo",
        "type": "income",
        "descriptions": ["Sueldo mensual"],
        "amount_range": (1_250_000, 1_450_000),
        "occurrences": 1,
        "day": 5,
        "step": 1_000,
    },
    {
        "category": "Freelance",
        "type": "income",
        "descriptions": [
            "Proyecto freelance",
            "Consultoría",
            "Diseño de identidad",
            "Sesión de fotografía",
        ],
        "amount_range": (180_000, 650_000),
        "occurrences": 2,
        "day": None,
        "step": 5_000,
    },
    {
        "category": "Vivienda",
        "type": "expense",
        "descriptions": [
            "Arriendo departamento",
            "Reparación departamento",
            "Compra de cortinas",
            "Repuestos de baño",
        ],
        "amount_range": (28_000, 320_000),
        "occurrences": 3,
        "day": 5,
        "step": 1_000,
    },
    {
        "category": "Alimentación",
        "type": "expense",
        "descriptions": [
            "Supermercado",
            "Almacén",
            "Mercado",
            "Panadería",
            "Restaurante",
            "Café",
            "Delivery",
        ],
        "amount_range": (6_000, 90_000),
        "occurrences": 10,
        "day": None,
        "step": 500,
    },
    {
        "category": "Transporte",
        "type": "expense",
        "descriptions": [
            "Bencina",
            "Bip!",
            "Estacionamiento",
            "Mantención auto",
            "Taxi",
            "Revisión técnica",
        ],
        "amount_range": (3_000, 65_000),
        "occurrences": 6,
        "day": None,
        "step": 500,
    },
    {
        "category": "Servicios",
        "type": "expense",
        "descriptions": [
            "Cuenta de luz",
            "Cuenta de agua",
            "Internet y teléfono",
            "Plan de cellphone",
            "Streaming",
            "Suscripción de gimnasio",
        ],
        "amount_range": (9_000, 78_000),
        "occurrences": 5,
        "day": None,
        "step": 500,
    },
]


def _amount(rng: random.Random, low: int, high: int, step: int) -> Decimal:
    steps = max(1, (high - low) // step)

    return Decimal(low + rng.randint(0, steps) * step)


class Command(BaseCommand):
    help = "Genera transacciones de demostración para un mes."

    def add_arguments(self, parser):
        parser.add_argument(
            "--month",
            default=None,
            help="Mes en formato YYYY-MM (por defecto, el mes actual).",
        )
        parser.add_argument(
            "--seed",
            type=int,
            default=42,
            help="Semilla aleatoria para generar siempre los mismos datos.",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Elimina las transacciones existentes del mes antes de insertar.",
        )

    def handle(self, *args, **options):
        year, month = self._parse_month(options["month"])
        rng = random.Random(options["seed"])

        categories = {
            category.name: category
            for category in Category.objects.filter(
                name__in=[template["category"] for template in TEMPLATES]
            )
        }

        missing = [
            template["category"]
            for template in TEMPLATES
            if template["category"] not in categories
        ]

        if missing:
            raise CommandError(
                f"Faltan categorías: {', '.join(missing)}. "
                "Ejecuta `python manage.py migrate` para crearlas."
            )

        transactions = self._build_transactions(year, month, rng, categories)

        with db_transaction.atomic():
            if options["reset"]:
                deleted, _ = Transaction.objects.filter(
                    date__year=year, date__month=month
                ).delete()
                self.stdout.write(
                    f"Eliminadas {deleted} transacciones de {year}-{month:02d}."
                )

            Transaction.objects.bulk_create(transactions)

        income = sum(
            (t.amount for t in transactions if t.type == "income"), Decimal("0")
        )
        expenses = sum(
            (t.amount for t in transactions if t.type == "expense"), Decimal("0")
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Creadas {len(transactions)} transacciones en {year}-{month:02d}."
            )
        )
        self.stdout.write(f"  Ingresos: {income:,.0f} CLP")
        self.stdout.write(f"  Gastos:   {expenses:,.0f} CLP")
        self.stdout.write(f"  Balance:  {income - expenses:,.0f} CLP")

    def _parse_month(self, value: str | None) -> tuple[int, int]:
        if not value:
            today = date.today()

            return today.year, today.month

        try:
            year, month = (int(part) for part in value.split("-"))
        except ValueError:
            raise CommandError(
                f"Mes inválido: {value!r}. Usa el formato YYYY-MM."
            )

        if not 1 <= month <= 12:
            raise CommandError(f"Mes inválido: {month}. Debe estar entre 1 y 12.")

        return year, month

    def _build_transactions(
        self,
        year: int,
        month: int,
        rng: random.Random,
        categories: dict[str, Category],
    ) -> list[Transaction]:
        days_in_month = monthrange(year, month)[1]
        last_day = days_in_month

        today = date.today()
        if (year, month) == (today.year, today.month):
            last_day = min(last_day, today.day)

        transactions: list[Transaction] = []

        for template in TEMPLATES:
            category = categories[template["category"]]

            for _ in range(template["occurrences"]):
                if template["day"] is not None:
                    day = min(template["day"], last_day)
                else:
                    day = rng.randint(1, last_day)

                transactions.append(
                    Transaction(
                        description=rng.choice(template["descriptions"]),
                        amount=_amount(
                            rng,
                            *template["amount_range"],
                            step=template["step"],
                        ),
                        type=template["type"],
                        date=date(year, month, day),
                        category=category,
                    )
                )

        transactions.sort(key=lambda t: (t.date, t.category.name))

        return transactions
