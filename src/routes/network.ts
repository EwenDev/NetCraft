import os from "os";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.get("/infos", (req: Request, res: Response) => {
    const networkInterfaces = os.networkInterfaces();

    // Afficher les informations
    res.json(networkInterfaces);
})

export default router;