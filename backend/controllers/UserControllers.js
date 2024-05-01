const expressAsyncHandler = require("express-async-handler");
const { genrateToken } = require("../config/genrateTocken")
const bcrypt = require('bcrypt');
const user = require("../Models/user");
const OTP=require("../Models/otp")
const otpGenerator = require("otp-generator");
const {mailSender}=require("../utils/mailsender")
const otpTemplate=require("../utils/mailtemplate")
exports.registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, otp,pic } = req.body;
    console.log(otp)
    if (!name || !email || !password || !otp) {
        res.status(400);
        throw new Error("please enter all details");
    }
    const userExits = await user.findOne({ email })
    if (userExits) {
        res.status(400);
        throw new Error("user already exists");

        
    }
    const otpreq = await OTP.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);;
    if(otp!=otpreq.otp.toString()){
        res.status(400);
        throw new Error("Invalid OTP");
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
exports.mailSender=expressAsyncHandler(async(req,res)=>{
    try {
        const { email } = req.body
        const userExits = await user.findOne({ email })
        if (userExits) {
            res.status(400);
            throw new Error("User Already Exists go to Login");
        }
        
        var otp_gen = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        
        var otp=await  OTP.findOne({email:email});
        
        if(!otp){
            otp=await OTP.create({
                email:email,
                otp:otp_gen
            })
        }
        else{
            otp=await OTP.findOneAndUpdate({email:email},{otp:otp_gen})
        }
        await mailSender(email, "OTP verification mail", otpTemplate(otp_gen));
        res.status(200).json({
            success: true,
            message: "OTP entery created successfuly",
        })
    } catch (err) {
        console.log("while genrating otp error occured: " + err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
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

