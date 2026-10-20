from datetime import date
from decimal import Decimal
from typing import List, Optional

from django.db.models import DecimalField, Q, Sum
from django.db.models.functions import Coalesce, TruncMonth
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI
from ninja.errors import HttpError
from ninja.responses import Status

from .models import Category, Transaction
from .schemas import (
    CategoryOut,
    DashboardSummaryOut,
    ExpensesByCategoryOut,
    MonthlyTrendOut,
    TransactionIn,
    TransactionOut,
)

api = NinjaAPI(title="FinTrack API", version="0.1.0")


@api.get("/health", tags=["health"])
def health(request):
    return {"status": "ok"}


@api.get("/categories", response=List[CategoryOut], tags=["categories"])
def list_categories(request):
    return Category.objects.all()


@api.get("/transactions", response=List[TransactionOut], tags=["transactions"])
def list_transactions(
    request,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    type: Optional[str] = None,
    category_id: Optional[int] = None,
):
    queryset = Transaction.objects.all()

    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)
    if type:
        queryset = queryset.filter(type=type)
    if category_id:
        queryset = queryset.filter(category_id=category_id)

    return queryset


@api.post("/transactions", response={201: TransactionOut}, tags=["transactions"])
def create_transaction(request, payload: TransactionIn):
    category = _resolve_category(payload)

    transaction = Transaction.objects.create(
        description=payload.description,
        amount=payload.amount,
        type=payload.type,
        date=payload.date,
        category=category,
    )

    return Status(201, transaction)


@api.get(
    "/transactions/{transaction_id}",
    response=TransactionOut,
    tags=["transactions"],
)
def get_transaction(request, transaction_id: int):
    return get_object_or_404(Transaction, id=transaction_id)


@api.put(
    "/transactions/{transaction_id}",
    response=TransactionOut,
    tags=["transactions"],
)
def update_transaction(request, transaction_id: int, payload: TransactionIn):
    transaction = get_object_or_404(Transaction, id=transaction_id)
    category = _resolve_category(payload)

    transaction.description = payload.description
    transaction.amount = payload.amount
    transaction.type = payload.type
    transaction.date = payload.date
    transaction.category = category
    transaction.save()

    return transaction


@api.delete(
    "/transactions/{transaction_id}",
    response={204: None},
    tags=["transactions"],
)
def delete_transaction(request, transaction_id: int):
    transaction = get_object_or_404(Transaction, id=transaction_id)
    transaction.delete()

    return Status(204, None)


def _resolve_category(payload: TransactionIn) -> Category:
    category = get_object_or_404(Category, id=payload.category_id)

    if category.type != payload.type:
        raise HttpError(400, "La categoría debe coincidir con el tipo de transacción.")

    return category


def _filtered_queryset(
    start_date: Optional[date], end_date: Optional[date]
):
    queryset = Transaction.objects.all()

    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)

    return queryset


def _sum_by_type(queryset, type_: str) -> Decimal:
    result = queryset.filter(type=type_).aggregate(
        total=Coalesce(Sum("amount"), 0, output_field=DecimalField())
    )
    return result["total"]


@api.get(
    "/dashboard/summary",
    response=DashboardSummaryOut,
    tags=["dashboard"],
)
def dashboard_summary(
    request,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
):
    queryset = _filtered_queryset(start_date, end_date)

    total_income = _sum_by_type(queryset, "income")
    total_expenses = _sum_by_type(queryset, "expense")

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_balance": total_income - total_expenses,
    }


@api.get(
    "/dashboard/expenses-by-category",
    response=List[ExpensesByCategoryOut],
    tags=["dashboard"],
)
def dashboard_expenses_by_category(
    request,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
):
    queryset = _filtered_queryset(start_date, end_date).filter(type="expense")

    rows = (
        queryset.values("category_id", "category__name")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )

    return [
        {
            "category_id": row["category_id"],
            "category_name": row["category__name"],
            "total": row["total"],
        }
        for row in rows
    ]


@api.get(
    "/dashboard/monthly-trends",
    response=List[MonthlyTrendOut],
    tags=["dashboard"],
)
def dashboard_monthly_trends(
    request,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
):
    queryset = _filtered_queryset(start_date, end_date)

    rows = (
        queryset.annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(
            income=Coalesce(
                Sum("amount", filter=Q(type="income")),
                0,
                output_field=DecimalField(),
            ),
            expenses=Coalesce(
                Sum("amount", filter=Q(type="expense")),
                0,
                output_field=DecimalField(),
            ),
        )
        .order_by("month")
    )

    return [
        {
            "month": row["month"].strftime("%Y-%m"),
            "income": row["income"],
            "expenses": row["expenses"],
        }
        for row in rows
    ]
