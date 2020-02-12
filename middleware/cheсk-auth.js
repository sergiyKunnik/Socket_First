const jwt = require('jsonwebtoken');
const settings = require('../settings');

module.exports = (req, res, next) => {
    console.log(req.headers);
    try{
        // const decoded = jwt.verify(req.body.token, settings.JWT_SECRET);

        req.userData = jwt.verify(req.headers.token, settings.JWT_SECRET);

        
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}