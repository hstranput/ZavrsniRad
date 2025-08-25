const crypto = require('crypto');

let activeQrToken = '';

const generateNewToken = (io) => {
    activeQrToken = crypto.randomBytes(16).toString('hex');
    if (io) {
        io.to('display_clients_room').emit('new_qr_token', activeQrToken);
        console.log(`Novi QR token generiran: ${activeQrToken}`);
    }
};

const isValid = (token) => {
    return token === activeQrToken;
};

const getActiveToken = () => {
    return activeQrToken;
};

module.exports = { generateNewToken, isValid, getActiveToken }; 