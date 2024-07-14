// Constants for the code

// Gets the emailjs instance that is in public/index.html
const emailjs = window.emailjs;

// The length of the codes sent to the user will always be 6 characters
const codeLength = 6;

// These are the characters used by the code generator
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Stores the code generated
let code = '';

/**
 * Generates a code to be sent to the user via email.
 */
const generateCode = () => {
    // Generates a 6 digit code from the letters given
    for (var i = 0; i < codeLength; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
};

/**
 * The function description goes here.
 * @param {string} toEmail - The email to send the verification code to.
 * @param {boolean} shouldSendEmail - For testing/debugging - should the email actually be sent.
 */
const sendEmail = (toEmail, shouldSendEmail = true) => {
    // Generates the code from the function
    generateCode();

    // Debug - print the code instead of sending the email
    !shouldSendEmail && console.log(code);

    // Sends the email to the user, using the template from emailjs
    shouldSendEmail &&
        emailjs
            .send('default_service', 'template_7l6tf2n', {
                code: code,
                email: toEmail,
            })
            .then((res) => {
                console.log('Success', res);
            })
            // Prints errors if there are any
            .catch((err) => console.error(err));
};

/**
 * Verifies whether or not the code given is the one that was sent to the user.
 * @param {string} givenCode - The code inputted by the user
 * @return {boolean} Whether or not the code given was the correct code.
 */
const verifyCode = (givenCode) => {
    console.log(givenCode, code);

    if (givenCode.toLowerCase() === code.toLowerCase()) {
        code = '';
        return true;
    }
    return false;
};

export { sendEmail, verifyCode };
