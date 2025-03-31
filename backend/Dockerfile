# Usar Node.js como base
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos del backend
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Comando para iniciar el backend
CMD ["npm", "start"]
