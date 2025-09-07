const SensorData = require('../models/SensorData')
const User = require('../models/User')
const CheckIn = require('../models/CheckIn')


// podatci sa senzora
exports.getLatestSensorData = async (req, res) => {
    try {
        // dohvati najnovije podatke sa oba senzora u paraleli (koristi se samo jedan jer imam jedan senzor trenutno)
        const latest = await Promise.all([
            SensorData.findOne({ sensorId: '1' }).sort({ timestamp: -1 }).lean(),
            SensorData.findOne({ sensorId: '2' }).sort({ timestamp: -1 }).lean()
        ])

        
        const sensorOne = latest[0] // uzmi prvi rezultat iz polja latest jer je to rezultat za senzor 1
        const sensorTwo = latest[1] // uzmi drugi rezultat iz polja latest jer je to rezultat za senzor 2
        
        res.set('Cache-Control', 'no-store') // onemogući cache jer želimo uvijek svježe podatke

        res.json({ sensor1: sensorOne, sensor2: sensorTwo })
    } catch (err) {
        console.error('Nisam uspio dohvatiti podatke sa senzora:', err)
        res.status(500).json({ message: 'Greška na serveru (senzori).' })
    }
}

// Popunjenost
exports.getOccupancy = async (req, res) => {
    try {
        // status je "unutra" kad je osoba prijavljena
        const insideCount = await User.countDocuments({ status: 'unutra' })

      
        res.json({ occupancy: insideCount })
    } catch (e) {
        
        res.status(500).send('Greška pri dohvaćanju broja ljudi.')
    }
}

// Dnevna statistika


exports.getDailyStats = async (req, res) => {
    try {
        // Dobivamo danasnji datum kao string u formatu 'YYYY-MM-DD' za hrvatsku vremensku zonu.
        // Ovo je referentna vrijednost s kojom cemo usporedivati.
        const todayString = new Intl.DateTimeFormat('fr-CA', {
            timeZone: 'Europe/Zagreb'
        }).format(new Date());

       

        const daily = await CheckIn.aggregate([
            //  dodaj novo polje koje predstavlja datum check-ina u hrvatskoj zoni
            {
                $addFields: {
                    'checkInDateLocal': {
                        $dateToString: {
                            format: '%Y-%m-%d', // formatiraj u 'YYYY-MM-DD'
                            date: '$checkInTime',
                            timezone: 'Europe/Zagreb' // konvertiraj u hrvatsku vremensku zonu
                        }
                    }
                }
            },

            // Filtriraj samo one dokumente gdje se datumi podudaraju
            {
                $match: {
                    'checkInDateLocal': todayString
                }
            },
            
            //  Dohvati podatke o korisniku 
            {
                $lookup: {
                    from: 'users', // Ime kolekcije za korisnike
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },

            //  Makni podatke o korisniku da ne budu u polju
            {
                $unwind: '$userData'
            },
            
            //  Sortiramo rezultate po vremenu, od najnovijeg prema najstarijem
            {
                $sort: {
                    checkInTime: -1
                }
            },

            // Formatiraj konačni output
            {
                $project: {
                    _id: 1,
                    checkInTime: 1,
                    checkOutTime: 1,
                    user: { // Ručno rekreiramo "populate" objekt
                        _id: '$userData._id',
                        name: '$userData.name',
                        email: '$userData.email'
                    }
                }
            }
        ]);

        

        res.json(daily);

    } catch (error) {
        console.error('*** GREŠKA U getDailyStats ***:', error);
        res.status(500).send('Server Error (daily stats)');
    }
};

// Mjesecna statistika
exports.getMonthlyVisits = async (req, res) => {
    try {
        // pocetak trenutnog mjeseca (npr. 1.8.2025.)
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        // koristi se aggregate 
        const report = await User.aggregate([
            { $match: { role: 'user' } }, // filtrira samo korisnike
            {
                $lookup: { // za sve koji su korisnici pretraži njihove check-ine
                    from: 'checkins',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', '$$userId'] }, // pronađi checkine za tog korisnika
                                        { $gte: ['$checkInTime', monthStart] } // samo ovaj mjesec
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'monthlyCheckIns' // polje u koje se spremaju rezultati
                }
            },
            
            {
                $project: {
                    _id: 0,
                    userName: '$name',
                    visitCount: { $size: '$monthlyCheckIns' }
                }
            },
            { $sort: { visitCount: -1 } }
        ])

        res.json(report)
    } catch (err) {
        console.error('Greška kod mjesečnog izvještaja:', err)
        res.status(500).send('Došlo je do greške u mjesečnom izvještaju.')
    }
}
