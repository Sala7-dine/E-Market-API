import dotenv from 'dotenv';
dotenv.config();
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import 'winston-mongodb';

const transports = [
    new DailyRotateFile({
        filename: 'public/logs-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d'
    }),
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
            })
        )
    })
];

// Add MongoDB transport only if MONGO_URI is set
if (process.env.MONGO_URI) {
    transports.push(
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: 'logs',
            level: 'error'
        })
    );
} else {
    // visible hint during development/seed runs
    console.warn('MONGO_URI not set; MongoDB logging disabled');
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new DailyRotateFile({
            filename: 'public/logs-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
                })
            )
        }),
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: 'logs',
            level: 'error'
        })
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: 'public/exceptions-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        })
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: 'public/rejections-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

export default logger;
