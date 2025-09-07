# Koristimo Node.js sliku
FROM node:20-alpine

# Postavljamo radni direktorij unutar kontejnera
WORKDIR /usr/src/app

# kopiramo package.json i instaliramo ovisnosti.
# ovo se radi odvojeno da docker moze iskoristiti cache
# i ne instalira sve iznova pri svakoj promjeni koda.
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Izlazemo port 4200 na kojem radi 'ng serve'
EXPOSE 4200

# Zadana naredba koja ce se pokrenuti.
# Poziva "start" skriptu iz package.json.
CMD ["npm", "start"]
