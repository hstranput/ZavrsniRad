const User = require('../models/User')
const CheckIn = require('../models/CheckIn')
const qrTokenService = require('../services/qrTokenService')

// QR check-in logika
exports.qrCheckIn = async (req, res) => {
    // dohvatiti token i user ID kako bi se mogla provjeriti valjanost QR koda i naći user kako bi se njegova prijava zabilježila
    const { qrToken } = req.body 
    const userId = req.user.id   
    
    // prvo provjera QR tokena – bez toga ne idemo dalje
    if (!qrTokenService.isValid(qrToken)) {
        return res.status(400).json({ message: 'QR kod nije važeći ili je istekao.' })
    }

    try {
        const foundUser = await User.findById(userId)

        if (!foundUser) {
            return res.status(404).json({ message: 'Korisnik nije pronađen.' })
        }

        
       
        // Ako je korisnik vani → znači ulazi unutra
        if (foundUser.status === 'van') {
            foundUser.status = 'unutra'
            
            // zapisujemo check-in (mogao bi dodati i lokaciju kasnije)
            await CheckIn.create({ user: foundUser._id })
            
            responseMsg = `Dobrodošli, ${foundUser.name}!`
        } else {
            // inače znači da izlazi
            foundUser.status = 'van'

            // pronalazim zadnji check-in bez checkouta → updateam ga
            const last = await CheckIn.findOne({
                user: foundUser._id,
                checkOutTime: null
            }).sort({ checkInTime: -1 }) // najnoviji
            
            if (last) {
                last.checkOutTime = new Date()
                await last.save()
            } else {
                // nisam siguran jel ovo može uopće nastat, ali neka ostane ovdje
                console.warn(`User ${foundUser._id} izlazi bez check-ina.`)
            }

            responseMsg = `Doviđenja, ${foundUser.name}!`
        }

        await foundUser.save()
        res.json({ message: responseMsg })
    } catch (err) {
        console.error('Greška kod QR check-in-a:', err)
        res.status(500).json({ message: 'Server Error (qrCheckIn).' })
    }
}
