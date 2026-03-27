const jwt = require('jsonwebtoken');

exports.authorization = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try{
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                success:false,
                message: "Invalid token"
            })
        }
        req.user = decoded;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }
   
}