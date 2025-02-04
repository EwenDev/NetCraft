import express, { Request, Response } from "express";
import { Role, User } from "../models/users";
import crypto from "crypto";
import pool from "../utils/db";
import { check, validationResult } from "express-validator";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get(
    "/user",
    [
        check('username').optional().isString().withMessage('Username doit être une chaîne de caractères'),
    ],
    async (req: Request, res: Response): Promise<void> => {
        let user;
        if(req.session.user.role === Role.ADMIN && req.query.username) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            user = req.query.username;
        } else {
            user = req.session.user.username;
        }
        try {
            const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [user]);
            if (Array.isArray(rows) && rows.length == 0) {
                res.status(404).json({ error: "Utilisateur inconnu" });
                return;
            }

            res.json({ email: rows[0].email, username: rows[0].username, role: rows[0].role })
            return
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ error: "Server error" });
        }
    }
)

router.get("/users", async (req: Request, res: Response): Promise<void> => {
    if(req.session.user?.role !== Role.ADMIN) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    try {
        const [rows] = await pool.query<User[] & RowDataPacket[][]>("SELECT * FROM users");
        res.json(rows.map((user: any) => ({ email: user.email, username: user.username, role: user.role })))
        return
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ error: "Server error" });
    }
})

router.patch(
    "/user", 
    [
        check("target").optional().isString().withMessage("Target doit être une chaîne de caractères"),
        check("password").optional().isString().isLength({ min: 6 }).withMessage("Le mot de passe doit avoir au moins 6 caractères"),
        check("oldpassword").optional().isString().isLength({ min: 6 }).withMessage("Le mot de passe doit avoir au moins 6 caractères"),
    ],
    async (req: Request, res: Response): Promise<void> => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { password, oldpassword, target } = req.body;

    let user;
    if(req.session.user.role === Role.ADMIN && target) {
        user = target;
    } else {
        if(target) {
            res.status(403).json({error: "Seul un admin peut modifier un autre utilisateur"});
            return
        }
        user = req.session.user.username;
    }

    if(!password) {
        res.status(400).json({error: "Aucune donnée à mettre à jour"});
        return;
    }

    if(user === "admin") {
        res.status(403).json({error: "Impossible de modifier l'utilisateur admin"});
        return;
    }

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [user]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(404).json({ error: "Utilisateur inconnu" });
            return;
        }

        let passwordToUpdate: string;
        if(password) {
            if(user !== "admin" && !oldpassword) {
                res.status(400).json({error: "Veuillez fournir l'ancien mot de passe"});
                return;
            }
            
            const [oldhashedPassword, oldsalt] = rows[0].password_hash.split(":");
            const hashedOldPassword = crypto
            .createHash("sha256")
            .update(oldpassword + oldsalt)
            .digest("hex");

            if(hashedOldPassword !== oldhashedPassword) {
                res.status(401).json({error: "Mot de passe incorrect"});
                return;
            }
            
            const salt = crypto.randomBytes(16).toString("hex");
            const hashedPassword = crypto
            .createHash("sha256")
            .update(password + salt) // ajout d'un sel pour plus de sécurité
            .digest("hex");
            const passwordHashWithSalt = `${hashedPassword}:${salt}`;
            passwordToUpdate = passwordHashWithSalt;
        } else {
            passwordToUpdate = rows[0].password_hash;
        }

        const [result] = await pool.query(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            [passwordToUpdate, user]
        );

        res.json({ message: "Utilisateur modifié avec succès" });
        return;
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error" });
    }
})

router.delete(
    "/user",
    [
        check('username').optional().isString().withMessage('Username doit être une chaîne de caractères'),
    ],
    async (req: Request, res: Response): Promise<void> => {
        let user;
        if(req.session.user.role === Role.ADMIN && req.query.username) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            user = req.query.username;
        } else {
            if(req.query.username) {
                res.status(403).json({error: "Seul un admin peut modifier un autre utilisateur"});
                return
            }
            user = req.session.user.username;
        }

        user = decodeURIComponent(user)

        if(user === "admin") {
            res.status(403).json({error: "Impossible de supprimer l'utilisateur admin"});
            return;
        }
    
        try {
            const [rows] = await pool.query("DELETE FROM users WHERE username = ?", [user]);
            if (Array.isArray(rows) && rows.length == 0) {
                res.status(404).json({ error: "Utilisateur inconnu" });
                return;
            }

            if(user === req.session.user.username) {
                req.session.destroy((err) => console.error("Erreur dans la suppression de sessions", err));
            }

            res.json({ message: "Utilisateur supprimé avec succès" });
            return
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ error: "Server error" });
        }
    }
)

export default router;