# Usamos la imagen oficial de Node.js como base
FROM node:22-alpine

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /src/app

# Copiamos los archivos de dependencias de Yarn
COPY package.json yarn.lock ./

# Instalamos las dependencias con Yarn
RUN yarn install --frozen-lockfile

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Exponemos el puerto en el que la aplicación estará escuchando
EXPOSE 7000

# Comando para iniciar la aplicación con Yarn
CMD ["yarn", "dev"]
