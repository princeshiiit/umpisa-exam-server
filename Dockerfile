# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN node ace build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from build stage
COPY --from=build /app/build .

# Copy swagger.yml for AutoSwagger (needs to be at root level)
COPY swagger.yml /swagger.yml

# Expose the application port
EXPOSE 3333

# Start the application
CMD ["node", "bin/server.js"]
