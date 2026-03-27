const User = require("../model/modal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileOnCloud = require("../cloud");

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// employ registration
exports.createClient = async(req, res) =>{
    try{
        const {name, contact, email, password} = req.body;

        let imgUrl = " ";

        if(req.file){
            let pic = await fileOnCloud(req.file.path);
            imgUrl = pic.secure_url;
        }

        console.log("imgUrl", imgUrl);

        const setEmail = await User.findOne({email});
        
        const hashPass = await bcrypt.hash(password, 10)
        const newUser = await User.create({name, contact, email, password:hashPass, img:imgUrl})
        
        if(!newUser) return res.status(400).json({wrn:"User did not found"})
        
        return res.status(200).json({msg:"Congratulation! Your form has successfully submitted", user:newUser})
    }
    catch(err){
        console.log(err);
    }
    
}

// employ login
exports.userLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        console.log(user);

        console.log("Email:", email);
        console.log("Password from frontend:", password);
        console.log("Password from DB:", user.password);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            myData : user,
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    contact: user.contact,
                    img: user.img,
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


