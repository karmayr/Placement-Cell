const genrateOtp = async () => {
    return (Math.floor(1000 + Math.random() * 9000));
}

const otpTimeout = async (otpTime) => {
    try {

        const currentTime = new Date().getTime();
        let diff = (otpTime - currentTime) / 1000;
        diff /= 60;
        if (Math.abs(diff) > 1) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
    }
}

const otpExpiryFiveMin = async (otpTime) => {
    try {

        const currentTime = new Date().getTime();
        let diff = (otpTime - currentTime) / 1000;
        diff /= 60;
        if (Math.abs(diff) > 5) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
    }
}










module.exports = {
    genrateOtp,
    otpTimeout,
    otpExpiryFiveMin
}

