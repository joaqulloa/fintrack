FinTrack — Data Model

1. Overview

FinTrack will use PostgreSQL as its relational database.

The initial data model consists of two entities: Category and Transaction.

The model is designed to support transaction management, category-based filtering, and financial summaries.

2. Category

Represents a classification for financial transactions.

Fields

Field	Type	Constraints
id	BIGINT	Primary key
name	VARCHAR(100)	Required
type	VARCHAR(10)	Required
created_at	TIMESTAMPTZ	Required
updated_at	TIMESTAMPTZ	Required

Rules

* The type must be either income or expense.
* Category names may be repeated across different types.
* Categories must not be deleted while they are referenced by transactions.
* The initial categories will be predefined.

3. Transaction

Represents an income or expense movement.

Fields

Field	Type	Constraints
id	BIGINT	Primary key
description	VARCHAR(255)	Required
amount	NUMERIC(14,2)	Required, greater than zero
type	VARCHAR(10)	Required
date	DATE	Required
category_id	BIGINT	Required foreign key
created_at	TIMESTAMPTZ	Required
updated_at	TIMESTAMPTZ	Required

Rules

* The amount must be greater than zero.
* The type must be either income or expense.
* Each transaction must reference an existing category.
* The transaction type must match the category type.
* Deleting a category referenced by a transaction must be prevented.
* Financial amounts must use decimal-compatible types.

4. Relationships

One Category can have many Transactions.

Each Transaction belongs to exactly one Category.

Relationship:

Category 1 ---- N Transaction

5. Financial Calculations

The financial dashboard will calculate the following values:

Total Income

The sum of all income transactions within the selected date range.

Total Expenses

The sum of all expense transactions within the selected date range.

Net Balance

Net Balance = Total Income - Total Expenses

Expenses by Category

The sum of expense transactions grouped by category within the selected date range.

Monthly Trends

Income and expenses grouped by calendar month.

All financial summaries must be calculated using persisted transaction data.

6. Indexes

The initial database should include indexes that support common queries:

* Transaction date.
* Transaction type and date.
* Transaction category and date.

The final index strategy may be adjusted after reviewing actual query patterns.

7. Future Entities

The following entities are outside the initial implementation:

* User: authentication and data ownership.
* Budget: monthly spending limits by category.
* RecurringTransaction: recurring financial movements.

These entities may be introduced in later iterations.