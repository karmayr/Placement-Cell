const moment = require('moment-timezone');

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

const separateDateTime = (datetime) => {
    // Check if datetime is provided
    if (!datetime) {
        return { date: 'No Date', time: 'No Time', ampm: 'No AM/PM' };
    }
    // Split the datetime string using 'T' as the separator
    const [date, time] = datetime.split('T');
    // Parse the time string and format it using moment.js with AM/PM indicator
    const parsedTime = moment(time, 'HH:mm').format('hh:mm A');

    return { date, time: parsedTime };
}









module.exports = {
    genrateOtp,
    otpTimeout,
    otpExpiryFiveMin,
    separateDateTime
}

