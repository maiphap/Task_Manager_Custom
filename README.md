# 📝 Task Manager - MERN Stack

A full-stack, feature-rich Task Management application inspired by Trello. This project is built using the **MERN** stack (MongoDB, Express, React, Node.js) and features real-time drag-and-drop mechanics, nested task modeling, and secure Google OAuth integration.

🔗 **Live Demo:** https://task-manager-custom-nine.vercel.app

---

## ✨ Features

- **Authentication & Authorization**:
  - Secure credential-based login and registration (JWT & bcrypt).
  - Modern "Sign in with Google" integration using `@react-oauth/google`.
- **Boards Management**:
  - Create, view, and customize multiple project boards.
  - Update board titles, descriptions, and backgrounds.
- **Lists & Cards**:
  - Create multiple columns (lists) within a board to represent workflow stages (e.g., Todo, Doing, Done).
  - Add, edit, and delete task cards within lists.
  - Set card titles, descriptions, due dates, and assign members.
- **Drag-and-Drop Workflow**:
  - Intuitive interface powered by `react-beautiful-dnd` to drag lists and cards across the board seamlessly.
- **Responsive & Modern UI**:
  - Styled with `styled-components` and `@mui/material`.
  - Custom SVG Loading animations and polished components.

---

## 🛠 Tech Stack

**Frontend (Client)**

- **Framework**: React.js (v17)
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Styled-Components, Material-UI (MUI), Atlaskit CSS Reset
- **Routing**: React Router DOM (v5)
- **Drag & Drop**: React-Beautiful-DnD
- **Network**: Axios
- **Auth**: `@react-oauth/google`

**Backend (Server)**

- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JsonWebToken (JWT), Bcrypt.js, `google-auth-library`
- **Security & Middleware**: CORS, dotenv, express-unless

---

## 📂 Project Structure

```bash
task-manager-custom/
├── client/                     # React Frontend
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── Components/         # Reusable UI components (Pages, Modals, Drawers)
│   │   ├── Images/             # Local assets (e.g., logo.svg)
│   │   ├── Redux/              # Redux slices and store configuration
│   │   ├── Services/           # API interaction functions (Axios calls)
│   │   ├── Utils/              # Helper functions & Protected Routes
│   │   ├── App.js              # Main React component
│   │   └── index.js            # React entry point with Providers
│   ├── package.json
│   └── .env                    # Frontend environment variables
│
└── server/                     # Express & Node.js Backend
    ├── Controllers/            # Route logic (Auth, Board, List, Card)
    ├── Middlewares/            # JWT verification & Express-unless settings
    ├── Models/                 # Mongoose Data Schemas (User, Board, List, Card)
    ├── Routes/                 # Express API routing endpoints
    ├── Services/               # Database interaction and helpers
    ├── server.js               # Entry point of the backend Node server
    ├── package.json
    └── .env                    # Backend environment variables
```

---

## 🔧 Environment Variables Setup

Before running the application, you must configure the following `.env` files.

### 1. Server Configuration (`server/.env`)

Create a `.env` file in the `server` directory:

```env
PORT=3001
MONGO_URI=mongodb+srv://<db_user>:<db_password>@<cluster>.mongodb.net/?appName=<AppName>
JWT_SECRET=your_super_secret_jwt_key
TOKEN_EXPIRE_TIME=1h
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 2. Client Configuration (`client/.env`)

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

_(Note: When deploying, change `REACT_APP_API_URL` to your live backend domain)._

---

## 🚀 Installation & Running Locally

Follow these steps to spin up the application on your local machine.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd task-manager-custom
```

### 2. Run the Backend (Server)

```bash
cd server
npm install
npm start
```

_The server will start on `http://localhost:3001` và connect to MongoDB._

### 3. Run the Frontend (Client)

Open a new terminal window:

```bash
cd client
npm install --legacy-peer-deps
npm start
```

_The React app will launch in your browser at `http://localhost:3000`._

> **Important**: The `--legacy-peer-deps` flag is required because of a peer dependency conflict between React 17 and `@atlaskit/css-reset`.

---

## ☁️ Deployment Instructions

### Backend (Render)

1. Push your code to GitHub.
2. Go to [Render.com](https://render.com) and create a new **Web Service**.
3. Point to the `server` folder (or use root if separated).
4. Set the Build Command to `npm install` and Start Command to `node server.js` or `npm start`.
5. Add all the Environment Variables from `server/.env` into Render's Environment section.
6. Deploy! _(Your API will be live at `https://<your-app>.onrender.com`)_.

### Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com) and import your repo.
2. Select the `client` directory as the Root directory.
3. Overwrite the Build Command if needed, typically `npm run build`.
4. Add all Environment Variables from `client/.env` (Make sure `REACT_APP_API_URL` points to your newly deployed Render Backend).
5. **Crucial Step for React-OAuth conflict**: In Vercel's Environment Variables, add `npm_config_legacy_peer_deps` with the value `true` to force Vercel to bypass peer-dependency errors.
6. Deploy!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a Pull Request.

## 📝 License

This project is open-source and available under the [ISC License](LICENSE).
