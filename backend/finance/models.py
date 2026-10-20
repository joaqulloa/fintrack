from django.core.exceptions import ValidationError
from django.db import models


class TransactionType(models.TextChoices):
    INCOME = "income", "Ingreso"
    EXPENSE = "expense", "Gasto"


class Category(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TransactionType.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "categoría"
        verbose_name_plural = "categorías"
        ordering = ["type", "name"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(type__in=["income", "expense"]),
                name="category_type_valid",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class Transaction(models.Model):
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    type = models.CharField(max_length=10, choices=TransactionType.choices)
    date = models.DateField()
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="transactions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "transacción"
        verbose_name_plural = "transacciones"
        ordering = ["-date", "-id"]
        indexes = [
            models.Index(fields=["date"], name="transaction_date_idx"),
            models.Index(fields=["type", "date"], name="transaction_type_date_idx"),
            models.Index(
                fields=["category", "date"], name="transaction_category_date_idx"
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(amount__gt=0),
                name="transaction_amount_positive",
            ),
            models.CheckConstraint(
                condition=models.Q(type__in=["income", "expense"]),
                name="transaction_type_valid",
            ),
        ]

    def clean(self):
        super().clean()

        if self.category_id and self.category and self.category.type != self.type:
            raise ValidationError(
                {"category": "La categoría debe coincidir con el tipo de transacción."}
            )

    def __str__(self):
        return f"{self.description} - {self.amount}"
