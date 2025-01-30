import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/schemas.js';


export const register = async(req, res) => {

    
    try{
            const {username, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);

                        const existingUser = await user.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "Email already exists" });
                }

            const newUser = new user({
                email,
                username,
                password: hashedPassword,
            });
            const savedUser = await newUser.save();
            console.log("User saved:", savedUser);
            res.status(201).json({message:"user saved sucess"})
}
catch(err){
    console.log(err);
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ message: `${field} already exists.` });
      }
  
      res.status(500).json({ message: "Error: Failed to create user." });
    }}

export const  login = async(req,res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await user.findOne({ username }).lean();
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        

        // token generation
        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({ id: existingUser.id, isAdmin: true }, "my_secret", { expiresIn: age});
        const { password: userPassword, ...userInfo } = existingUser            ;
        console.log("User logged in:", userInfo);
        res                                  
          .cookie("token", token, {

            httpOnly: true,
            // secure:true
            maxAge: age,
          })
          .status(200)
          .json({userInfo});
    } catch (error) {
        console.error("Error during login:", error); 
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const logout = (req,res) => {
    res.clearCookie("token").status(200).json({message:"Logged out : successfully :)"});
}