const otpStore={};
export const setOtp=(email,otp)=>{
    otpStore[email]={
        otp,
        expire:Date.now()+5*60*1000
    };
};
export const getOtp=(email)=>{
    return otpStore[email];
};
export const deleteOtp=(email)=>{
    delete otpStore[email];
};