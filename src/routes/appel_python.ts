import express, { Request, Response } from "express";
import { PythonShell } from "python-shell";
import path from "path";
import { check, validationResult } from "express-validator";

const router = express.Router();

const basedir = process.env.NODE_ENV === 'production' ? path.join(__dirname, "..") : path.join(__dirname, "..", "..");

router.post(
  '/construction_trame', 
  [
    check("adr_dst").isString().notEmpty().withMessage("une adresse mac de destination est requise"),
    check("adr_src").isString().notEmpty().withMessage("une addresse mac source est requise"),
    check("type").isNumeric().notEmpty().withMessage("un type est requis"),
    check("data").isString().notEmpty().withMessage("des données sont requises")
  ],
  async (req: Request, res: Response): Promise<void> => {
    const { adr_dst, adr_src, type, data } = req.body;

    const shell = new PythonShell(path.resolve(basedir, "scripts", "eth.py"), { args: [JSON.stringify({
      function_name: 'createFrame',
      args: [adr_dst, adr_src, data, type]
    })] });

    let output: string[] = [];

    shell.on('message', (message) => {
      output.push(message);
    });
    
    shell.on('pythonError', (error) => {
      output.push(error.message);
    })

    shell.on('close', () => {
      res.json({ trame: output.join('\n') });
    });
  }
  );
  

//ping
router.post(
  '/ping',
  [
    check("ip").isString().notEmpty().withMessage("une ip est requise")
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { ip } = req.body;

    if (!ip) {
      res.status(400).json({ error: "L'adresse IP est requise" });
      return;
    }
      const shell = new PythonShell(path.resolve(basedir, "scripts", "eth.py"), { args: [JSON.stringify({
        function_name: 'sendPing',
        args: [ip]
      })] });

      let output: string[] = [];

      shell.on('message', (message) => {
        output.push(message);
      });

      shell.on('pythonError', (error) => {
        output.push(error.message);
      })

      shell.on('close', () => {
        res.json({ response: output.join('\n') });
      });
    }
  )

//connexion TCP
router.post(
  '/TCP',
  [
    check("ip").isString().notEmpty().withMessage("une ip est requise"),
    check("port").isNumeric().notEmpty().withMessage("un port est requis")
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { ip, port } = req.body;
    if (!ip) {
      res.status(400).json({ error: "L'adresse IP cible est requise" });
      return;
    }

    const shell = new PythonShell(path.resolve(basedir, "scripts", "eth.py"), { args: [JSON.stringify({
      function_name: 'sendTCP',
      args: [ip, port]
    })] });

      let output: string[] = [];

      shell.on('message', (message) => {
        output.push(message);
      });

      shell.on('pythonError', (error) => {
        output.push(error.message);
      })

      shell.on('close', () => {
        res.json({ response: output.join('\n') });
      });
    }
)


export default router;
