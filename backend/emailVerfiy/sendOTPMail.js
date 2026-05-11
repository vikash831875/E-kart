import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();



dotenv.config();

export const sendOTPMail = async(otp,email)=>{
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Use App Password (IMPORTANT)
  },
});

// Mail Configuration
const mailConfigurations = {
  from: process.env.MAIL_USER,
  to: email,
  subject: "Passowrd reset otp",

  html:`<p>Your OTP for password resert is : <b>${otp}</b> </p>`
};

transporter.sendMail(mailConfigurations,function(error,info){
    if(error) throw Error(error);
    console.log('OTP sent Successfully');
    console.log(info);
})

}







