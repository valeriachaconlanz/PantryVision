# PantryVision

Snap a photo of your fridge or pantry and get recipes made from what you already have.

PantryVision identifies ingredients from photos, text, or voice, then suggests three recipes at a time that fit your diet (low carb, keto, paleo, vegan, vegetarian, high macro, no seed oils), allergies, meal type, cooking equipment, and available time.

> **Status:** project setup. The folders and pages below are placeholders; no features are built yet.

## Tech stack

| Layer | Technology | Why |
| --- | --- | --- |
| Backend language | **Java 21** | Team's main language, current LTS |
| Backend framework | **Spring Boot 4** (Spring Web MVC, Spring Data JPA, Validation, Actuator) | REST API, database access, request validation, health checks |
| Build tool | **Maven** (wrapper included, `./mvnw`) | No local Maven install needed |
| Database | **PostgreSQL** (production), **H2** in-memory (local default) | H2 lets anyone run the app with zero setup |
| Frontend | **React 19 + Vite**, React Router | Runs in the browser, which is needed for photo compression, local photo history, and speech-to-text |
| AI | Vision-capable LLM API (provider to be decided) | Ingredient recognition and recipe generation |
| Recipe data | External recipe API (e.g. Spoonacular, to be decided) | Recipes from a second source besides the LLM |
| Planned | Spring Security (auth), browser Web Speech API (voice input) | Added when those features are built |

## Project structure

```
PantryVision/
├── backend/                         Spring Boot REST API (Java)
│   ├── pom.xml
│   └── src/main/java/com/pantryvision/
│       ├── PantryVisionApplication.java
│       ├── auth/         Registration, login, accounts (FR-2)
│       ├── user/         Diet preferences and allergies (FR-1, FR-3)
│       ├── ingredient/   Photo / text / voice ingredient input (FR-3 to FR-9)
│       ├── recipe/       Suggestions, filters, details (FR-10 to FR-18)
│       ├── rating/       Ratings and feedback (FR-15)
│       ├── library/      Saved recipes by type (FR-19, FR-20)
│       ├── ai/           LLM and recipe API clients
│       ├── config/       Security, CORS, API settings
│       └── common/       Shared helpers and error handling
├── frontend/                        React + Vite web app
│   └── src/
│       ├── pages/        One file per screen (Home, Login, Onboarding, Search, Recipes, ...)
│       ├── components/   Reusable UI pieces
│       ├── hooks/        Custom React hooks
│       ├── utils/        Helpers (e.g. image compression)
│       └── api/          Calls to the backend
└── .env.example                     Environment variables to copy into .env
```

Each backend package has a `package-info.java` describing what goes in it. Inside a package, use the usual Spring layers: `XController`, `XService`, `XRepository`, and entity/DTO classes.

## Getting started

### Prerequisites

- **JDK 21 or newer** (`java -version`)
- **Node.js 20.19+ or 22+** (`node -v`)
- Git

### 1. Clone

```bash
git clone https://github.com/valeriachaconlanz/PantryVision.git
cd PantryVision
cp .env.example .env
```

### 2. Run the backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

Check it at http://localhost:8080/actuator/health. It should return `{"status":"UP"}`.
The H2 database console is at http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:pantryvision`, user `sa`, no password).

To use PostgreSQL instead, set the `DB_*` variables and run:

```bash
SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run
```

### 3. Run the frontend (port 5173)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Requests to `/api/...` are forwarded to the backend automatically.

### Useful commands

| Where | Command | What it does |
| --- | --- | --- |
| `backend/` | `./mvnw test` | Run backend tests |
| `backend/` | `./mvnw package` | Build a runnable JAR into `target/` |
| `frontend/` | `npm run build` | Production build into `dist/` |
| `frontend/` | `npm run lint` | Lint the frontend |

## Team workflow

1. Pull the latest `main`: `git checkout main && git pull`
2. Create a branch for your task: `git checkout -b feature/short-description` (or `fix/...`)
3. Commit small, clear changes: `git commit -m "Add diet preference survey form"`
4. Push and open a pull request into `main`: `git push -u origin feature/short-description`
5. Get at least one teammate's review before merging.

Never commit `.env` or API keys.

## Team

Roles rotate each sprint.

| Member | Current role |
| --- | --- |
| Valeria Chacon | Scrum Master / Developer |
| Karina Villalobos Hernandez | Developer / Graphic Designer |
| Marlon Castillo | Product Owner / Developer |
| Perla Caceres-Calixto | Tester / Developer |
| Mizell Jackson | Tester / Developer |
| Owen Martinez | Tester / Developer |

We meet Tuesdays at 4 p.m. (main meeting) and Fridays as needed.
