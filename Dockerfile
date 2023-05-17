# Utilisez une image de base contenant Node.js
FROM node:latest

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json (s'ils existent) pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez tous les fichiers du répertoire actuel vers le répertoire de travail dans le conteneur
COPY . .

# Définir le volume pour partager les fichiers
VOLUME ["/app/static"]

EXPOSE 3000

CMD ["npm", "start"]
