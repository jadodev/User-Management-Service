# Etapa 1: Construcción
FROM node:22-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de dependencias y configuración
COPY package.json yarn.lock tsconfig.json ./ 

# Instala las dependencias (incluyendo dev)
RUN yarn install --frozen-lockfile

# Copia el resto del código fuente (incluyendo la carpeta src y index.ts)
COPY . .

# Ejecuta el proceso de compilación (se asume que en package.json tienes definido "build": "tsc")
RUN yarn build

# Etapa 2: Imagen de producción
FROM node:22-alpine

WORKDIR /app

# Copia los archivos necesarios para producción
COPY package.json yarn.lock ./

# Instala solo las dependencias de producción
RUN yarn install --production

# Copia el código compilado desde la etapa de build
COPY --from=builder /app/dist ./dist

# Expone el puerto en el que corre la aplicación (ajusta si es necesario)
EXPOSE 8000

# Comando para iniciar la aplicación (se asume que el archivo compilado es dist/index.js)
CMD ["node", "dist/index.js"]
