import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import "winston-mongodb";

const transports = [
  new DailyRotateFile({
    filename: "public/logs-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
  }),
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
      }),
    ),
  }),
];

if (process.env.MONGO_URI && process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: "logs",
      level: "error",
    }),
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: "public/exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: "public/rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;
