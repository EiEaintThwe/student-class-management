# Student Class Management System

A web application for managing classes and students. The React frontend communicates with Laravel API endpoints to provide dashboard counts, student CRUD operations, class CRUD operations, search, filtering, and pagination.

### Dashboard
- Displays the total number of students.
- Displays the total number of classes.

### Student Management
- Create, view, edit, and delete students.
- Assign one class to each student.
- Search by name, email, or phone.
- Filter students by class.
- Paginate student records, with 10 records per page.
- Display inline validation and API error messages.

### Class Management
- Create, view, edit, and delete classes.
- Display the number of students in each class.
- Prevent deletion of a class that still has associated students.

## Tech Stack

| Backend | Laravel 12, PHP 8.2+ 
| Frontend | React 19, JavaScript (ES modules) 
| Styling | Tailwind CSS 4 
| HTTP Client | Axios 
| Build Tool | Vite 7 
| Database | SQLite by default; Laravel database configuration may be changed 
| API Authentication Package | Laravel Sanctum 4 

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- A supported database driver for the configured database
- mysql support if using the default `.env.example` configuration

## Installation


1. Install backend dependencies:

composer install

2. Install frontend dependencies:

npm install

3. Create the environment file:

cp .env.example .env


4. Generate the application key:

php artisan key:generate


## Environment Configuration

The supplied `.env.example` uses mysql:

DB_CONNECTION=mysql
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

## Database Setup

Run migrations and seeders:

php artisan migrate:fresh --seed

The seeder creates:
- Five classes named `Class 1` through `Class 5`
- Two sample students

To run migrations without resetting existing data:

php artisan migrate

## Run the Application

Start the Laravel development server:

php artisan serve


Start the Vite development server in a separate terminal:

npm run dev


To create a production frontend build:

npm run build

## Project Structure

app/
├── Http/
│   └── Controllers/
│       ├── Api/
│       │   ├── ClassController.php
│       │   └── StudentController.php
│       └── Controller.php
└── Models/
    ├── SchoolClass.php
    ├── Student.php
    └── User.php
database/
├── migrations/
├── seeders/
│   ├── DatabaseSeeder.php
│   ├── SchoolClassSeeder.php
│   └── StudentSeeder.php
└── database.mysql
resources/
├── css/
│   └── app.css
├── js/
│   ├── app.jsx
│   ├── main.jsx
│   ├── pages/
│   │   ├── Classes.jsx
│   │   ├── Dashboard.jsx
│   │   └── Students.jsx
│   └── services/
│       └── api.js
└── views/
    └── app.blade.php
routes/
├── api.php
└── web.php
tests/
└── Feature/
    └── ExampleTest.php
```

## Frontend Architecture

- `main.jsx` mounts the React application.
- `app.jsx` manages the active page and navigation between Dashboard, Students, and Classes.
- `pages/Dashboard.jsx` loads dashboard totals through separate student and class API requests.
- `pages/Students.jsx` manages student forms, search, class filtering, pagination, loading state, and API validation/error state.
- `pages/Classes.jsx` manages class creation, editing, deletion, loading state, and messages.
- `services/api.js` configures Axios with a `/api` base URL and JSON headers.
- The root web route serves the React application for every unmatched URL, allowing client-side page rendering.

## Database Schema

### `classes`

| Column | Type | Constraints |
|---|---|---|
| `id` | bigint | Primary key |
| `name` | string | Required, unique |
| `created_at` | timestamp | Nullable |
| `updated_at` | timestamp | Nullable |

### `students`

| Column | Type | Constraints |
|---|---|---|
| `id` | bigint | Primary key |
| `class_id` | bigint | Foreign key, required |
| `name` | string | Required |
| `email` | string | Required, unique |
| `phone` | string | Nullable, maximum 20 characters |
| `created_at` | timestamp | Nullable |
| `updated_at` | timestamp | Nullable |

`students.class_id` references `classes.id`. Deleting a referenced class is restricted on the database and also checked in `ClassController`.

### Relationships

- `SchoolClass` has many `Student` records.
- `Student` belongs to one `SchoolClass`.
- Eloquent eager loads the student's `schoolClass` relationship.
- Class listings use `withCount('students')`.

## API Endpoints


### Students

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Paginated list of students |
| `POST` | `/api/students` | Create a student |
| `GET` | `/api/students/{id}` | Return one student |
| `PUT` | `/api/students/{id}` | Update a student |
| `DELETE` | `/api/students/{id}` | Delete a student |

**List query parameters**

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Filters name, email, or phone using a partial match |
| `class_id` | integer | Filters students by class |
| `page` | integer | Requests a pagination page |

The endpoint returns Laravel's paginated JSON response with 10 records per page.

**Create/update request body**

| Field | Validation |
|---|---|
| `class_id` | Required; must exist in `classes` |
| `name` | Required; string; maximum 255 characters |
| `email` | Required; valid email; unique in `students` |
| `phone` | Optional; string; maximum 20 characters |

The email uniqueness rule ignores the current student when updating.

Responses:
- `201` is returned after creation and includes `message` and `student`.
- `200` is returned after retrieval or update.
- `200` is returned after deletion and includes `message`.

### Classes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/classes` | List all classes with each student's count |
| `POST` | `/api/classes` | Create a class |
| `GET` | `/api/classes/{id}` | Return one class and its students |
| `PUT` | `/api/classes/{id}` | Update a class |
| `DELETE` | `/api/classes/{id}` | Delete a class |

**Create/update request body**

| Field | Validation |
|---|---|
| `name` | Required; string; maximum 255 characters; unique |

The class name uniqueness rule ignores the current class when updating.

Responses:
- `201` is returned after creation.
- `422` is returned when deleting a class with associated students.
- `200` is returned after retrieval, update, or successful deletion.

### Auth Test Endpoint

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user` | Returns the authenticated user |

This endpoint requires Laravel Sanctum authentication. It is not used by the current React frontend.

## Validation and Error Handling

- Laravel request validation returns HTTP `422` responses with field-level `errors`.
- React forms display field-level validation messages and general error feedback.
- Confirmation dialogs are shown before student or class deletion.
- The frontend displays loading and empty-table states.
- Class deletion is blocked in the API when any associated student exists.
- No custom global exception format or frontend authentication handling is implemented.

## Authentication and Security

- Laravel Sanctum support and the `/api/user` protected route are configured.
- The student and class CRUD routes are public in the current API configuration.
- No login, registration, role, permission, or authorization middleware is implemented for the CRUD pages.
- Student email and class name uniqueness are enforced by validation and database constraints.

