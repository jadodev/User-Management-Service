# Usa la imagen oficial de Node.js como base
FROM node:22-alpine

# Habilita Corepack y prepara la versión de Yarn (según lo que requiera tu proyecto)
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Establece el directorio de trabajo en el contenedor
WORKDIR /src/app

# Copia los archivos de dependencias y la configuración de Yarn Berry
COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .pnp.cjs .pnp.cjs

# Instala las dependencias usando Yarn
RUN yarn install --immutable

# Copia el resto de los archivos de la aplicación
COPY . .

# Expon el puerto 7000 (en el contenedor)
EXPOSE 7000

# Inicia la aplicación
CMD ["yarn", "dev"]
