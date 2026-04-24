function errorHandler(err, req, res, next) {
    console.error(`[Error Handler] ${new Date().toISOString()} ${err.message}`);
    
    const status = err?.status && Number.isInteger(err.status) ? err.status : 500;
    const message = err?.message || 'Internal server error';
    const timestamp = new Date().toISOString();
    
    const response = {
        status,
        message,
        timestamp,
    };
    
    res.status(status).json(response);
}

module.exports = errorHandler;