# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps --quiet --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN npm run build -- --configuration production

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
