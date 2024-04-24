const expressAsyncHandler = require("express-async-handler");
const { genrateToken } = require("../config/genrateTocken")
const bcrypt = require('bcrypt');
const user = require("../Models/user");
exports.registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("please enter all details");
    }
    const userExits = await user.findOne({ email })
    if (userExits) {
        res.status(400);
        throw new Error("user already exists");


    }
    const hashedpass = await bcrypt.hash(password, 10);
    const User = await user.create({
        name, email, password: hashedpass, pic
    })
    if (User) {
        res.status(201).json({
            _id: User._id,
            name: User.name,
            email: User.email,
            pic: User.pic,
            token: genrateToken(User._id)
        })
    } else {
        res.status(400)
        throw new Error("failed to create the user")
    }
})
exports.authUser = async (req, res) => {
    const { email, password } = req.body;
    const User = await user.findOne({ email })
    try {
        if (User && (await bcrypt.compare(password, User.password))) {
            res.status(201).json({
                _id: User._id,
                name: User.name,
                email: User.email,
                pic: User.pic,
                token: genrateToken(User._id)
            })
        } else {
            res.status(400)
            throw new Error("User Did Not exist")

        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Something went wrong...",
        })
    }
    
}

exports.alluser = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    const User = await user.find(keyword)
    res.send(User)
})

