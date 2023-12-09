const Drive = require('../models/driveData');
const { joiDriveSchema } = require('../joiSchemas/joiSchemas');




module.exports.validateJoiDriveData = (req, res, next) => {
    const { error } = joiDriveSchema.validate(req.body);
    if (error) {
        throw new AppError(error.details.map(elem => elem.message).join(","), 400);
    } else {
        next();
    }
}