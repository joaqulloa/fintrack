from datetime import date, datetime
from decimal import Decimal
from typing import Literal
from ninja import Schema
from pydantic import Field


class CategoryOut(Schema):
    id: int
    name: str
    type: str
    created_at: datetime
    updated_at: datetime


class TransactionIn(Schema):
    description: str = Field(min_length=1, max_length=255)
    amount: Decimal = Field(gt=0)
    type: Literal["income", "expense"]
    date: date
    category_id: int


class TransactionOut(Schema):
    id: int
    description: str
    amount: Decimal
    type: str
    date: date
    category_id: int
    created_at: datetime
    updated_at: datetime


class DashboardSummaryOut(Schema):
    total_income: Decimal
    total_expenses: Decimal
    net_balance: Decimal


class ExpensesByCategoryOut(Schema):
    category_id: int
    category_name: str
    total: Decimal


class MonthlyTrendOut(Schema):
    month: str
    income: Decimal
    expenses: Decimal
