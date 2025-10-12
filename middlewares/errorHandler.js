const errorHandler = (err, req, res, next) => {
    console.error("error handler :", err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Erreur serveur",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

export default errorHandler;
