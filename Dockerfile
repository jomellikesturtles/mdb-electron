# Stage 1: Build the Angular application
FROM node:21-alpine AS build

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=8000"
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1

# Copy package files and install dependencies
COPY package*.json ./
# COPY package.json ./
RUN npm install --ignore-scripts --legacy-peer-deps --no-audit --no-fund --loglevel error --fetch-timeout=600000
# RUN npm install` --legacy-peer-deps --quiet --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN node --max-old-space-size=8000 ./node_modules/@angular/cli/bin/ng build --configuration production

# Remove source maps to reduce final image size
RUN find dist/mdb-electron -name "*.map" -type f -delete

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's html directory
# Note: The output path may vary depending on angular.json configuration
COPY --from=build /app/dist/mdb-electron /usr/share/nginx/html

# Copy a custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
