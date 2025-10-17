import logger from '../config/logger.js';

const loggerMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const ip = req.ip || req.connection.remoteAddress;

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip,
            userAgent: req.get('user-agent')
        });
    });

    next();
};

export default loggerMiddleware;
