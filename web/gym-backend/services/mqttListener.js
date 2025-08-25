const mqtt = require('mqtt')
const SensorData = require('../models/SensorData')
require('dotenv').config()  

const startMqttListener = () => {
  // opcije za spajanje na broker (u .env su podaci)
  const options = {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD
    
  }

  const client = mqtt.connect(process.env.MQTT_HOST, options)// spajanje na broker

  // topici koje slušamo (zasad samo 1 jer imamo 1 senzor)
  const topics = [
    'teretana/senzor/1/podaci',
    'teretana/senzor/2/podaci'
  ]

  client.on('connect', () => {  // kad se spoji na broker
    console.log(' Spojen na MQTT broker!')

    client.subscribe(topics, (err) => { // pretplata na topice
      if (err) {
        console.error('Greška kod pretplate na topice:', err)
      } else {
        console.log(`Pretplaćen na: ${topics.join(', ')}`)
      }
    })
  })

  client.on('message', async (topic, message) => { // kad stigne poruka na neki od topica
    
    console.log(`[MQTT] ${topic}: ${message.toString()}`) 

    try {
      // pokušaj parsiranja JSONa
      const parsed = JSON.parse(message.toString())

      // izvuci ID senzora iz topica (3. segment)
      const sensorId = topic.split('/')[2]

      // spremati u bazu 
      const newReading = new SensorData({
        sensorId,
        temperatura: parsed.temperatura,
        tlak: parsed.tlak
      })

      await newReading.save()
      console.log('Novi podaci spremljeni u bazu.')

      
    } catch (err) {
      console.error('Greška kod obrade MQTT poruke:', err)
    }
  })

  client.on('error', (err) => {
    // ponekad baci error i kod reconnecta, treba to bolje hendlat
    console.error('MQTT client error:', err)
  })
}

module.exports = startMqttListener
