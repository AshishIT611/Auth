import nodemailer from "nodemailer";
const sendEmail=async(email,otp)=>{
    const transporter=nodemailer.createTransport({
        host:"sandbox.smtp.mailtrap.io",
        port:2525,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
        from:`"My App" <${process.env.EMAIL_USER || "test@example.com"}>`,
        to:email,
        subject:"OTP Verification",
        text:`Your OTP is ${otp}`
    });     
};
export default sendEmail;