const adminModel = require("../model/adminModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = (myAdmin) => {
    return jwt.sign(
        { 
            id: myAdmin._id, 
            email: myAdmin.email, 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};


exports.createAdmin = async(req, res) =>{
    try{
        const {name, email, password} = req.body;

        const setEmail = await adminModel.findOne({email});
        
        const hashPassword = await bcrypt.hash(password, 10)
        const newAdmin = await adminModel.create({name, email, password:hashPassword, role:"admin"})
        
        if(!newAdmin) return res.status(400).json({wrn:"User did not found"})
        
        return res.status(200).json({msg:"Congratulation! Your form has successfully submitted", admin:newAdmin})
    }
    catch(err){
        console.log(err);
    }
    
}


exports.adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user
        const myAdmin = await adminModel.findOne({ email });
        if (!myAdmin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, myAdmin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate token
        const token = generateToken(myAdmin);

        res.status(200).json({
            myData : myAdmin,
            success: true,
            message: 'Login successful',
            data: {
                myAdmin: {
                    id: myAdmin._id,
                    name: myAdmin.name,
                    email: myAdmin.email,
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};
