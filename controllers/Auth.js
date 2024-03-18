const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");



// sendOtp
exports.sendOtp = async (req, res) => {

    try {
        // fetch email from req ki body
        const { email } = req.body;

        // validate user is already present or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "user already exist",
            });
        }

        // if user not present then generate otp
        var otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        })

        // bhut hi bekar code likh raha hoon otp generate krne ke liye baad mn change kr lenge
        // make sure ki otp unique hona chahiye
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            })
            result = await OTP.findOne({ otp: otp });
        }

        // make entry of this otp in database
        // make object of otp
        // payload mn created at isiliye nhi dala bcs by default date.now date set kr dega current date
        const otpPayload = {
            email,
            otp,
        }

        // now make entry otp in db
        const otpBody = OTP.create(otpPayload);

        res.json({
            success: true,
            message: "otp sent successfully",
            otp,
        });

    }
    catch (error) {
        console.log(error);
    }
}

// signup
exports.signup = async (req, res) => {
    try {

        // data fetch kro req ki body se
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;
        // validate krlo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.json({
                success: false,
                message: "fill all details",
            });
        }
        // 2 password match krwa lol
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "password is not match",
            });
        }
        // check user exist or not 
        const existingUser = User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "user already exist",
            });
        }
        // find most recent otp stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        // validate otp
        if (recentOtp.length == 0) {
            return res.json({
                success: false,
                message: "otp is not found",
            });
        } else if (otp !== recentOtp.otp) {
            return res.json({
                success: true,
                message: "otp sent successfully",
            });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        // create additional details
        const ProfileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        // entry created in database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            contactNumber,
            accountType,
            additionalDetails:ProfileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        // return res
        return res.json({
            success:true,
            user,
            message:"user regitered successfully"
        });


    } catch (error) {
        console.log(error);
    }
};



// login

// changePassword
