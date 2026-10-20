FinTrack — Project Overview

Project type: Full Stack Web Application
Status: Planning
Version: 0.1.0

1. Overview

FinTrack is a personal finance management web application designed to help users track their income and expenses, understand their spending habits, and manage their monthly budgets.

The project aims to provide a simple, intuitive interface for recording financial transactions and visualizing financial activity through dashboards, charts, and reports.

FinTrack is also a learning project focused on applying Full Stack development practices and building a complete, maintainable web application.

2. Problem Statement

Managing personal finances can become difficult when income and expenses are recorded across different applications, spreadsheets, or informal methods.

Users need a centralized solution to record transactions, categorize expenses, monitor their financial balance, and identify spending patterns.

3. Project Objectives

* Build a functional personal finance management application.
* Implement a REST API using Python and Django Ninja.
* Develop a responsive frontend using Next.js and TypeScript.
* Design and implement a relational database using PostgreSQL.
* Apply software engineering practices, including testing, version control, and CI/CD.
* Deploy a working demonstration and document the development process.

4. Target Users

Individuals who want to organize their personal finances, track their income and expenses, and gain a clearer understanding of their spending habits.

5. Core Value Proposition

FinTrack provides a centralized and accessible way to record financial transactions, visualize spending patterns, and monitor personal financial activity.

6. Initial Scope

The first version will include:

* Financial dashboard.
* Income and expense tracking.
* Transaction categorization.
* Transaction history and filtering.
* Spending visualizations.
* Monthly financial summaries.

Features such as user authentication, custom budgets, CSV exports, and advanced reporting may be added in subsequent iterations.

7. Technology Stack

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Recharts

Backend

* Python
* Django
* Django Ninja

Database

* PostgreSQL

Development and Quality

* Git and GitHub
* Docker
* GitHub Actions
* Pytest

8. Success Criteria

The initial version will be considered successful when:

* Users can create, view, update, and delete financial transactions.
* Transactions are persisted in PostgreSQL.
* The dashboard displays accurate income, expense, and balance calculations.
* Users can filter transactions by date, type, and category.
* Financial charts reflect the stored transaction data.
* Core backend functionality is covered by automated tests.
* The application can be run locally using documented instructions.

9. Project Constraints

* The initial version will focus on a single-user financial workflow.
* Financial amounts will be stored using decimal-compatible database types.
* The application will initially use CLP as its default currency.
* External banking integrations and automatic transaction imports are outside the initial scope.
* Real banking credentials and sensitive financial information will not be required.

10. Future Improvements

Potential future features include:

* User registration and authentication.
* Custom categories and monthly budgets.
* Budget threshold notifications.
* CSV export and financial reports.
* Multi-currency support.
* Recurring transactions.
* Improved analytics and spending insights.