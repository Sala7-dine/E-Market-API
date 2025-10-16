import fs from "fs";
import path from "path";

// chemin du fichier logs.txt dans le dossier courant
const logFilePath = path.join(process.cwd(), "public/logs.txt");

const logger = (req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || 'Unknown';

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logMessage = `[${timestamp}] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms | IP: ${ip} | User-Agent: ${userAgent}\n`;
        
        console.log(logMessage.trim());
        
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) console.error("Erreur écriture log:", err);
        });
    });

    next();
};

export default logger;
