const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            message: 'Email already exists'
        });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            message: 'Referenced record does not exist'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
};

module.exports = errorHandler;
