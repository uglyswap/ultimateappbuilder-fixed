"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const error_handler_1 = require("./error-handler");
function validate(schema) {
    return (req, _res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                throw new error_handler_1.AppError(400, error.errors[0].message);
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map