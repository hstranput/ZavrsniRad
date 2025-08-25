const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()  

// middleware za zaštitu ruta
const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // iz headera se uzima samo token nakon 'Bearer'
      token = req.headers.authorization.split(' ')[1]

      // dekodiranje i provjera tokena
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // dohvaćanje usera iz baze (bez passworda)
      const authUser = await User.findById(decoded.id).select('-password')

      if (!authUser) {
        return res.status(401).json({ message: 'Niste autorizirani, korisnik ne postoji.' })
      }

      req.user = authUser

      // sve u redu -> pusti dalje
      return next()
    } catch (err) {
      
      console.error('JWT greška:', err.message)
      return res.status(401).json({ message: 'Nevažeći ili istekao token.' })
    }
  }

  // ako nema tokena uopće
  return res.status(401).json({ message: 'Niste autorizirani, token nedostaje.' })
}

// middleware koji provjerava dali je user admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    
    res.status(401).json({ message: 'Pristup dopušten samo administratorima.' })
  }
}

module.exports = { protect, admin }
