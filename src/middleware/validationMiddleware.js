/**
 * Validation middleware factory
 * Creates middleware to validate request body/params against Zod schemas
 */

const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const dataToValidate = source === 'params' ? req.params : req.body;

        const result = schema.safeParse(dataToValidate);

        if (!result.success) {
            const errors = result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors
            });
        }

        // Attach validated data to request
        if (source === 'params') {
            req.validatedParams = result.data;
        } else {
            req.validatedBody = result.data;
        }

        next();
    };
};

export default validate;
