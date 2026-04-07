# Local News Platform - Project Overview

This document serves as a comprehensive summary of the architecture, technology stack, and features implemented in the **Local News Platform** project up to this point.

## 🏗️ Architecture & Technology Stack

The project is built as a full-stack web application with separated frontend and backend codebases.

### Frontend Application
- **Build Tool:** Vite
- **Framework:** React 19
- **Routing:** React Router v7 (`react-router-dom`), handling dynamic page navigation.
- **Styling:** 
  - Tailwind CSS v4 (using `@tailwindcss/vite`)
  - Utility libraries: `clsx` and `tailwind-merge` for dynamic class management.
  - Icons provided by `lucide-react`.
  - Animations handled by `framer-motion` and Tailwind utility classes.
- **State Management:** React Context (`ThemeContext` for handling dark/light mode) and local component states.
- **Data Source Structure:** Capable of fetching from the backend API but also includes local static mock data (`src/data/newsData.js`) used in certain sections.

### Backend Application (`local-news-backend` folder)
- **Runtime Environment:** Node.js
- **Server Framework:** Express.js 5
- **Database:** **Local MongoDB**. 
  - Connection is defined via the `.env` file (`mongodb://localhost:27017/local-news`). *(Note: We are not currently using MongoDB Atlas, but it can be easily switched by modifying the `MONGO_URI`)*.
  - Object Data Modeling using `mongoose` v9. 
- **Authentication:** 
  - Passwords are hashed and secured using `bcryptjs`.
  - Session handling and secured admin routes use JSON Web Tokens (`jsonwebtoken`).
- **Additional Utilities:** 
  - `cors` for cross-origin requests.
  - `dotenv` for environment variable injection.

---

## 🚀 Features Implemented

### User Interface & Experience
- **Responsive Navigation:** A dynamic header (Navbar) and Footer.
- **Theming:** A built-in Day/Night theme toggler utilizing Context API and React state.
- **Pages & Components:**
  - **Homepage:** Displays Breaking News Ticker, Featured Articles, Latest Stories, and a Trending Sidebar fetching from the backend `/api/news` endpoint.
  - **Category Pages:** Dynamic category filtering directly powered by local mock data (`newsData.js`) to provide near-instant visual feedback.
  - **Article Page:** Handles reading individual articles.
  - **Search Page:** Allows users to query specific news.

### Securing CRUD Operations
- **Administrator Dashboard capabilities:** Securely manage articles.
  - *Create Article Page (`/create-article`)*
  - *Edit Article Page (`/edit-article/:id`)*
- **API Protection:** The backend ensures that Create, Update, and Delete actions are locked down only to users with a valid JWT token. 

---

## 🔧 Current Status & Observations
- The backend successfully communicates securely over localhost.
- There is a minor architectural split: the **Homepage** dynamically uses the Express backend data (which results in no articles if the local MongoDB is empty or the server isn't running), whereas the **Category Pages** rely on hardcoded static data.
- The project's frontend relies on heavy utility-first styling focusing on modern design aesthetics, maintaining both high performance (via Vite) and maintainability.
