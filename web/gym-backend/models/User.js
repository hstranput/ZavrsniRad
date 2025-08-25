const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// definicija korisnika
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Molimo unesite ime'],
  },
  email: {
    type: String,
    required: [true, 'Molimo unesite email'],
    unique: true, // jedinstven email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Molimo unesite ispravnu email adresu', // regex za validaciju emaila
    ],
  },
  password: {
    type: String,
    required: [true, 'Molimo unesite lozinku'], // obavezno polje
    minlength: 6, // minimalna dužina lozinke
    select: false, // ne vraća se u upitima prema bazi
  },
  status: {
    type: String,
    enum: ['unutra', 'van'],
    default: 'van',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, {
  timestamps: true, 
});


userSchema.pre('save', async function (next) { // hashiranje passworda prije spremanja
  
  if (!this.isModified('password')) {
    next();
  }

  
  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt);  // hashiranje
});


userSchema.methods.matchPassword = async function(enteredPassword) { // usporedba unesene lozinke s hashiranom
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);