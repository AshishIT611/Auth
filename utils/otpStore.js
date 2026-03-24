const otpStore={};
export const setOtp=(email,otp)=>{
    otpStore[email]={
        otp,
        expire:Date.now()+5*60*1000,
        verified:false
    };
};
export const getOtp=(email)=>{
    return otpStore[email];
};
export const verifyOtpStatus=(email)=>{
    if(otpStore[email]){
        otpStore[email].verified=true;
    }
}
export const deleteOtp=(email)=>{
    delete otpStore[email];
};