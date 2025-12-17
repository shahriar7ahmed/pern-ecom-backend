import morgan from 'morgan';
import logger from '../utils/logger.js';

// Create a stream object with a 'write' function that will be used by morgan
const stream = {
    write: (message) => logger.http(message.trim())
};

// Skip logging during tests
const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'test';
};

// Build the morgan middleware
const morganMiddleware = morgan(
    // Define message format string
    ':method :url :status :res[content-length] - :response-time ms',
    // Options: Override the stream and skip logic
    { stream, skip }
);

export default morganMiddleware;
