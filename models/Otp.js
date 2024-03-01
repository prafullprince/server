const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        required:true,
        expires:5*60,
    },
});

//  a function to send email
async function sendVerificationMail(email,otp){
    try{
        const mailResponse = await mailSender(email,"verification email from studyNotion",otp);
        console.log("email sent successfully",mailResponse);

    }catch(error){
        console.log("error while sending mail" , error);
        throw error;
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationMail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",otpSchema);
