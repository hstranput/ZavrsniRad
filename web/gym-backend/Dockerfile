# Koristimo Node.js sliku
FROM node:20-alpine

# Postavljamo radni direktorij unutar kontejnera
WORKDIR /usr/src/app

# Kopiramo package.json i instaliramo ovisnosti
COPY package*.json ./
RUN npm install

# Kopiramo ostatak koda aplikacije
COPY . .

# Izlazemo port na kojem aplikacija radi (npr. 3000)
EXPOSE 3000

# Naredba za pokretanje aplikacije.
CMD [ "node", "index.js" ]
