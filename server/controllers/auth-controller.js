const auth = require('../auth')
const db = require('../db');
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    try {
        let userIdOrEmail = auth.verifyUser(req); 
        if (!userIdOrEmail) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "User not logged in"
            })
        }

        const loggedInUser = await db.findUserByEmail(userIdOrEmail); 
        if (!loggedInUser) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "User not found"
            })
        }

        return res.status(200).json({
            loggedIn: true,
            user: {
                userName: loggedInUser.userName,
                email: loggedInUser.email,
                avatar: loggedInUser.avatar
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    console.log("loginUser BODY:", req.body);
    try {
        const { email, password } = req.body;
        console.log("Email received:", email);
        console.log("Password received:", password);

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await db.findUserByEmail(email);
        console.log("found user",existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser.email);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                userName: existingUser.userName,
                email: existingUser.email,
                avatar: existingUser.avatar             
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: false,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");

    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    
    try {
        const { userName, email, password, passwordVerify, avatar } = req.body;
        console.log("create user:", userName, email, password, passwordVerify, avatar);

        if (!userName || !email || !password || !passwordVerify || !avatar)  {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");

        console.log("About to run findUserByEmail()");
        const existingUser = await db.findUserByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ 
                    errorMessage: "An account with this email already exists." 
                });
        }
        console.log("indUserByEmail DONE:", existingUser);

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const newUser = await db.createUser({
            userName,
            email,
            passwordHash, 
            avatar
        });

        // LOGIN THE USER
        const token = auth.signToken(newUser.email); 
        console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                userName: newUser.userName,
                email: newUser.email,
                avatar: newUser.avatar              
            }
        })
        

        console.log("token sent");

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

updateAccount = async (req, res) => {
    try {
        console.log("Updating account...");

        
        const emailFromToken = auth.verifyUser(req);
        if (!emailFromToken) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }

        
        const existingUser = await db.findUserByEmail(emailFromToken);
        if (!existingUser) {
            return res.status(404).json({ errorMessage: "User not found" });
        }

        const { userName, password, passwordVerify, avatar } = req.body;

        
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    errorMessage: "Password must be at least 8 characters."
                });
            }
            if (password !== passwordVerify) {
                return res.status(400).json({
                    errorMessage: "Passwords do not match."
                });
            }
        }

        
        const updateObj = {
            userName: userName || existingUser.userName,
            avatar: avatar || existingUser.avatar
        };

        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateObj.passwordHash = await bcrypt.hash(password, salt);
        }

        
        const updatedUser = await db.updateUserByEmail(emailFromToken, updateObj);

        return res.status(200).json({
            success: true,
            user: {
                userName: updatedUser.userName,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        });

    } catch (err) {
        console.error("Update account error:", err);
        return res.status(500).json({
            errorMessage: "Server error updating account"
        });
    }
};




module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser, 
    updateAccount
}