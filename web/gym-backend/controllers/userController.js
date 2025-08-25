const User = require('../models/User')
const CheckIn = require('../models/CheckIn')

// kreiranje novog usera
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    // provjera jel email već postoji
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Korisnik s tim emailom već postoji' })
    }

    // stvaranje novog usera
    const newUser = await User.create({ name, email, password, role })

   
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    })
  } catch (err) {
    console.error('Greška kod kreiranja usera:', err) 
    res.status(500).json({ message: 'Server Error (createUser)' })
  }
}

// dohvati sve usere
exports.getAllUsers = async (req, res) => {
  try {
    // ne vraćati password
    const usersList = await User.find().select('-password')
    res.json(usersList)
  } catch (error) {
    res.status(500).json({ message: 'Server Error (getAllUsers)' })
  }
}

// obriši usera
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params  
    const userToDelete = await User.findById(id)

    if (userToDelete) {
      await userToDelete.deleteOne()
      res.json({ message: 'Korisnik izbrisan.' })
    } else {
      res.status(404).json({ message: 'Korisnik nije pronađen.' })
    }
  } catch (e) {
    console.error('Problem kod brisanja usera:', e)
    res.status(500).json({ message: 'Server Error (deleteUser)' })
  }
}

// dohvati moje check-ine 
exports.getMyCheckIns = async (req, res) => {
  try {
    const userId = req.user.id

    // dohvaćam check-inove sortirane po vremenu (zadnji prvi)
    const myCheckIns = await CheckIn.find({ user: userId }).sort({ checkInTime: -1 })

    
    res.json({
      totalVisits: myCheckIns.length,
      visits: myCheckIns
    })
  } catch (err) {
    console.error('Greška kod getMyCheckIns:', err)
    res.status(500).send('Server Error (getMyCheckIns)')
  }
}
