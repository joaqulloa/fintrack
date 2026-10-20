FinTrack — Architecture

1. Architectural Style

FinTrack will initially use a client-server architecture with a separate frontend, backend API, and relational database.

The application will follow a modular monolithic backend architecture. This approach keeps the system simple while maintaining clear separation of responsibilities.

2. Components

Frontend

Next.js, React, TypeScript, and Tailwind CSS.

Responsibilities:

* Render the user interface.
* Manage form state and user interactions.
* Consume backend API endpoints.
* Display financial summaries and charts.
* Handle loading, empty, and error states.

Backend API

Python, Django, and Django Ninja.

Responsibilities:

* Expose REST endpoints.
* Validate incoming requests.
* Enforce transaction and category business rules.
* Calculate financial summaries.
* Query and update persistent data.
* Return structured JSON responses.

Database

PostgreSQL.

Responsibilities:

* Persist transactions and categories.
* Enforce relational integrity.
* Support filtering and aggregation queries.
* Maintain consistent financial records.

3. Communication

The frontend will communicate with the backend through HTTP requests using JSON.

The backend will access PostgreSQL through Django’s ORM.

The frontend must not connect directly to the database.

4. Initial API Resources

* /api/health: health check.
* /api/categories: list available categories.
* /api/transactions: create and list transactions.
* /api/transactions/{id}: retrieve, update, or delete a transaction.
* /api/dashboard/summary: retrieve financial totals.
* /api/dashboard/expenses-by-category: retrieve expense distribution.
* /api/dashboard/monthly-trends: retrieve monthly income and expense totals.

5. Error Handling

The API will use appropriate HTTP status codes and structured error responses.

Examples:

* 200 OK: successful retrieval or update.
* 201 Created: successful resource creation.
* 204 No Content: successful deletion.
* 400 Bad Request: invalid request data.
* 404 Not Found: requested resource does not exist.
* 500 Internal Server Error: unexpected server error.

6. Environment Configuration

Environment-specific settings must be kept outside the source code.

The project will use environment variables for database configuration, API URLs, and other deployment-specific settings.

Secrets must never be committed to version control.

7. Testing Strategy

* Unit tests for financial calculations and business rules.
* API tests for CRUD operations and input validation.
* Integration tests for database-backed functionality.
* Frontend tests for critical user interactions.

8. Deployment Strategy

The application will initially run locally.

Once the core functionality is stable, the frontend and backend can be deployed separately, with PostgreSQL hosted in a suitable managed database service.