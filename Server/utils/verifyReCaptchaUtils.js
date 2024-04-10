
const verifyRecaptcha = async (recaptchaValue) => {
    try {
        console.log('Verifying reCAPTCHA...');

        const recaptchaSecretKey = "6Lepr7IpAAAAAJ6p9O8UFEiNIakd83l7iyURJRpj";
        const recaptchaEndpoint = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaValue}`;

        const recaptchaResult = await fetch(recaptchaEndpoint, {
            method: 'POST',
        });
        const recaptchaData = await recaptchaResult.json();

        console.log('reCAPTCHA verification result:', recaptchaData);
        return recaptchaData.success;
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
};

module.exports = {
    verifyRecaptcha,
};