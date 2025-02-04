import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import networkRoutes from "./routes/network";
import { User } from "./models/users";
import pythonRoutes from "./routes/appel_python";
import 'dotenv/config';
import session from 'express-session';
import memstore from "memorystore";
import path from "path";

const MemoryStore = memstore(session);

// Impossible d'ajouter un username à la session sans cette partie de code
declare module "express-session" {
    interface Session {
      user: User;
      isLoggedIn: boolean;
    }
}

const app = express();
const port = 3000;

app.use(express.json());
app.set('json escape', true);

// Configuration du middleware session
app.use(
  session({
    secret: process.env.SECRETKEY, // Clé pour signer le cookie de session
    resave: false,               // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: false,    // Ne pas créer de session vide
    store: new MemoryStore({
      checkPeriod: 86400000,     // Supprime les sessions sous 24h
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,    // Durée de vie du cookie (1 heure ici)
      httpOnly: true,            // Empêche l'accès au cookie via JavaScript
    },
  })
);

app.use("/api/auth", authRoutes);

const publicDeps = [
  "/login",
  "/signup",
  "/",
  "/js/passwordVisibility.js",
  "/js/auth.js",
  "/res/bruit_bg.png",
  "/res/logoNetCraft.svg",
  "/components/footer"
]

// Proxify le front end pour éviter l'affichage sans loggin
app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    if(req.path === "/home" || req.path === "/login" || req.path === "/signup") {
      res.redirect("/")
    } else {
      next();
    }
  } else {
    if(publicDeps.includes(req.path)) {
      next();
    } else {
      res.redirect("/login");
    }
  }
});

app.use(express.static(path.join(__dirname, "..", "public"), {index:false,extensions:['html']}));

app.get('/', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "..", "public", "outils.html"));
  } else {
    res.sendFile(path.join(__dirname, "..", "public", "home.html"));
  }
});

app.use("/api/appel_python", pythonRoutes);
app.use("/api", userRoutes);
app.use("/api/network", networkRoutes);

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost or http://localhost:3000`);
});

