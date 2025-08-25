const bcrypt = require('bcryptjs');


const lozinka = 'lozinka123';

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(lozinka, salt);

console.log(`Za lozinku: ${lozinka}`);
console.log('Vaša kriptirana (heširana) lozinka je:');
console.log(hash);