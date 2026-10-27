# PantryVision

PantryVision is our group project for class. The idea is you take a picture of your fridge or pantry and the app gives you recipes using the stuff you already have.

You can also type or say your ingredients instead of taking a picture. The recipes take into account your diet (low carb, keto, paleo, vegan, vegetarian, high macro, no seed oils), your allergies, the meal type, what cooking tools you have, and how much time you have. It shows 3 recipes at a time.

Right now this is just the starter code. The pages and folders are empty placeholders so we can all start working on our parts.

## Tech stack

- **Backend:** Java 21 + Spring Boot 4
- **Build tool:** Maven (the `mvnw` wrapper is included so you don't have to install Maven)
- **Database:** PostgreSQL. For local testing it uses H2, which runs in memory so you don't have to set up a database to run the app.
- **Frontend:** React + Vite. We need some JavaScript for the browser stuff like compressing photos, saving photo history on the user's device, and speech to text.
- **AI model:** still deciding which one to use
- **Recipe API:** still deciding (Spoonacular is one option)
- **Later on:** Spring Security for login, Web Speech API for voice input

## Folder structure

```
PantryVision/
├── backend/                  Java / Spring Boot code
│   └── src/main/java/com/pantryvision/
│       ├── auth/             sign up, log in, log out
│       ├── user/             diet preferences and allergies
│       ├── ingredient/       photo, text, and voice input
│       ├── recipe/           recipe suggestions and filters
│       ├── rating/           recipe ratings
│       ├── library/          saved recipes
│       ├── ai/               code that talks to the AI model and recipe API
│       ├── config/           app settings
│       └── common/           shared stuff
├── frontend/                 React code
│   └── src/
│       ├── pages/            one file per page
│       ├── components/       reusable pieces like buttons and cards
│       ├── hooks/            custom React hooks
│       ├── utils/            helper functions
│       └── api/              calls to the backend
└── .env.example              list of the keys/settings you need
```

Every backend folder has a `package-info.java` file that says what goes in it and which requirements (FR numbers from our doc) it covers.

## How to run it

You need:
- Java 21 or newer (check with `java -version`)
- Node.js 20.19 or newer (check with `node -v`)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/valeriachaconlanz/PantryVision.git
cd PantryVision
cp .env.example .env
```

### 2. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd spring-boot:run` instead.

To check if it's working go to http://localhost:8080/actuator/health. You should see `{"status":"UP"}`.

If you want to look at the database go to http://localhost:8080/h2-console and use:
- JDBC URL: `jdbc:h2:mem:pantryvision`
- User: `sa`
- Password: leave it blank

If you want to use PostgreSQL instead, fill in the `DB_` values in `.env` and run:

```bash
SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run
```

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then go to http://localhost:5173. Anything that calls `/api/...` gets sent to the backend automatically.

### Other commands

- `./mvnw test` (in backend) runs the backend tests
- `./mvnw package` (in backend) builds the backend into a .jar file
- `npm run build` (in frontend) builds the frontend
- `npm run lint` (in frontend) checks the frontend code for mistakes

## How we work on it

1. Get the latest code: `git checkout main` then `git pull`
2. Make your own branch: `git checkout -b feature/what-youre-doing`
3. Commit your changes: `git commit -m "Add diet survey page"`
4. Push your branch: `git push -u origin feature/what-youre-doing`
5. Open a pull request on GitHub and have at least one person look at it before merging

Please don't push straight to `main`, and don't commit your `.env` file or any API keys.

## Team

Our roles rotate every sprint.

- Valeria Chacon: Scrum Master / Developer
- Karina Villalobos Hernandez: Developer / Graphic Designer
- Marlon Castillo: Product Owner / Developer
- Perla Caceres-Calixto: Tester / Developer
- Mizell Jackson: Tester / Developer
- Owen Martinez: Tester / Developer

We meet Tuesdays at 4 pm and Fridays if we need to.
