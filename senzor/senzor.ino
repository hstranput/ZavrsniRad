#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Adafruit_BMP280.h> 
#include <ArduinoJson.h>
#include <Wire.h>


// Konfiguracijske postavke
const char* WIFI_SSID = "";
const char* WIFI_PASSWORD = "";
const char* MQTT_HOST = "01474c2b69ac4bb1b42021127163ed17.s1.eu.hivemq.cloud";
const int   MQTT_PORT = 8883;
const char* MQTT_USER = "Hrvoje";
const char* MQTT_PASSWORD = "Teretana123";
const char* MQTT_CLIENT_ID = "esp32-senzor-1";
const char* MQTT_TOPIC_PUBLISH = "teretana/senzor/1/podaci";

// Postavke za pinove
const int SDA_PIN = 18;
const int SCL_PIN = 19;


// Objekt za sigurnu mreznu komunikaciju TLS(SSL)
WiFiClientSecure secureClient;
// PubSubClient je biblioteka za MQTT komunikaciju
PubSubClient client(secureClient);
// Objekt za interakciju s BMP280 senzorom
Adafruit_BMP280 bmp; 

unsigned long lastMsgTime = 0;
// interval od 60 sekundi
const long MSG_INTERVAL = 60000;


// Funkcija koja inicijalizira spajanje na WiFi mrezu i ceka dok se veza ne uspostavi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Spajanje na WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

// Petlja se izvrsava i ispisuje tockice sve dok se ESP32 ne spoji na WiFi
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi spojen.");
  Serial.print("IP adresa: ");
  Serial.println(WiFi.localIP());
}


// Funkcija za spajanje na MQTT broker, ako ne uspije ispisuje se greska svakih 5 sekundi.
void reconnect_mqtt() {
 
  while (!client.connected()) {
    Serial.print("Pokušavam se spojiti na MQTT broker...");
    if (client.connect(MQTT_CLIENT_ID, MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("spojen!");
      
    } else {
      Serial.print(" neuspješno, rc=");
      Serial.print(client.state());
      Serial.println(" Pokušaj ponovno za 5 sekundi.");
      delay(5000);
    }
  }
}

// Funkcija setup koja se izvrsava samo prilikom pokretanja uredaja
void setup() {

  // Pokretanje serijske komunikacije za ispis poruka (serial monitor)
  Serial.begin(115200);
  delay(1000);

  // Pokretanje I2C komunikacije na ranije definiranim pinovima
  Wire.begin(SDA_PIN, SCL_PIN);
  
  // Pokretanje BMP280 na adresi 0x76
  if (!bmp.begin(0x76)) {
    Serial.println("Nije moguće pronaći BMP280 senzor, provjerite spojeve!");
    while (1); // Zaustavlja program ako senzor nije pronaden
  } else {
    Serial.println("BMP280 uspješno pronađen!");
  }
  
  // poziv funkcije za spajanje na WiFi
  setup_wifi();
  // postavljanje clienta da ne provjerava SSL certifikat brokera
  secureClient.setInsecure();
  // postavljanje adrese i porta brokera
  client.setServer(MQTT_HOST, MQTT_PORT);
}

// loop se izvrsava neprestano nakon sto se setup izvrsi
void loop() {
  // ako veza nije aktivna s brokerom, poziva se funkcija za ponovno spajanje
  if (!client.connected()) {
    reconnect_mqtt();
  }
  // odrzavanje MQTT veze i obrada dolaznih poruka
  client.loop();

  // provjera je li proslo dovoljno vremena od zadnjeg slanja poruke
  unsigned long now = millis();
  if (now - lastMsgTime > MSG_INTERVAL) {
    //azuriranje vremena zadnjeg slanja
    lastMsgTime = now;

    // ocitavanje temperature i tlaka sa senzora
    float temperatura = bmp.readTemperature(); 
    float tlak = bmp.readPressure() / 100.0F; 
    

    // provjera jesu li ispravne ocitane vrijednosti
    if (isnan(temperatura) || isnan(tlak)) { 
      Serial.println("Greška pri čitanju sa senzora!");
      return; // ako je doslo do greske preskoci ostatak petlje
    }

    // stvaranje JSON objekta za slanje podataka
    StaticJsonDocument<200> doc;
    doc["temperatura"] = temperatura;
    doc["tlak"] = tlak;
    
    // Pretvaranje Json objekta u string
    char buffer[200];
    serializeJson(doc, buffer);

    // objavljivanje poruke na zadani MQTT topic
    client.publish(MQTT_TOPIC_PUBLISH, buffer);

    // ispis poruke na serijski monitor za provjeru                                                 
    Serial.print("Poruka objavljena na topic ");
    Serial.println(MQTT_TOPIC_PUBLISH);
    Serial.println(buffer);
  }
}