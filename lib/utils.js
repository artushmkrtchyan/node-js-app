'use strict';
const bcrypt = require('bcrypt');
const fs = require('fs');

function isValidDate(str) {
    const dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
    const dateReg1 = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    if (str && (str.match(dateReg) || str.match(dateReg1))) {
        return true;
    } else {
        return false;
    }
}

function validateUrl(url) {
    const regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}

function isValidateEmail(email) {
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function generatePassword(password) {
    return bcrypt.hashSync(password, 10);
}

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,20}$/;
    return re.test(password);
}

function createNewFolder(dir) {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    isValidateEmail,
    validateUrl,
    isValidDate,
    generatePassword,
    checkPassword,
    validatePassword,
    createNewFolder,
};
