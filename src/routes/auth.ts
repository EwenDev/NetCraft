import express, { Request, Response } from "express";
import crypto from "crypto";
import pool from "../utils/db";
import { check, validationResult } from "express-validator";

const router = express.Router();

    
//inscription
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Veuillez fournir un email valide"),
    check("username").isString().notEmpty().withMessage("Le nom d'utilisateur est requis"),
    check("password").isString().isLength({ min: 6 }).withMessage("Le mot de passe doit avoir au moins 6 caractères"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, username, password } = req.body;

    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username]);


      if (Array.isArray(rows) && rows.length > 0) {
        res.status(401).json({ error: "L'email ou le nom d'utilisateur est déjà pris" });
        return;
      }

      const salt = crypto.randomBytes(16).toString("hex");

      const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt) // ajout d'un sel pour plus de sécurité
      .digest("hex");

      const passwordHashWithSalt = `${hashedPassword}:${salt}`;

      const [result] = await pool.query(
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        [email, username, passwordHashWithSalt]
      );


      res.status(201).json({
        message: "Utilisateur créé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ error: "Erreur du serveur" });
    }
  }
);

// Connexion
router.post(
  "/login",
  //Récupération et vérification du typage des données de la requête
  [
    check("username").notEmpty().withMessage("Le nom d'utilisateur est requis"),
    check("password").isLength({ min: 6 }).withMessage("Le mot de passe doit avoir au moins 6 caractères"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const {username, password } = req.body;
    // Processus de connexion 
    try {
      // Récupération du mot de passe en hash via une requête SQL
      const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

      // Vérifier que l'utilisateur est présent dans la BDD
      if (Array.isArray(rows) && rows.length == 0) {
        res.status(401).json({ error: "Utilisateur ou mot de passe incorrect" });
        return;
      }

      // Vérifier que le mdp est correct

      const passWDsplit = rows[0].password_hash.split(":")
      const hashedPassword = crypto
      .createHash("sha256")
      .update(password + passWDsplit[1]) // ajout d'un sel pour plus de sécurité
      .digest("hex");

      if (hashedPassword != passWDsplit[0]) {
         res.status(401).json({ error: "Utilisateur ou mot de passe incorrect" });
         return;
      } 
      
      // Si oui lancer la session
      req.session.user = { email: rows[0].email, username: rows[0].username, role: rows[0].role };
      req.session.isLoggedIn = true;

      res.status(201).json({
        message: "Session créée avec succès",
      });
      
    } catch (error) {
      console.error("Erreur lors de la connection :", error);
      res.status(500).json({ error: "Erreur du serveur" });
    }
  }
)

// Déconnexion
router.get(
  '/logout', 
  async (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send('Erreur lors de la déconnexion.');
    }
    res.redirect("/")
  });
}); 

export default router;
