import fs from "fs";
import path from "path";

// chemin du fichier logs.txt dans le dossier courant
const logFilePath = path.join(process.cwd(), "public/logs.txt");

const logger = (req, res, next) => {
    const now = new Date().toISOString();
    const logMessage = `[${now}] ${req.method} ${req.originalUrl}\n`;

    // Affiche dans la console
    console.log(logMessage.trim());

    // Écrit dans le fichier (ajout à la fin)
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error("Erreur écriture log:", err);
    });

    next(); // passe à la route suivante
};

export default logger;
