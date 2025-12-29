FROM node:18-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development

# Install deps first for caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

# Copy only what's needed for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app ./

EXPOSE ${PORT}

# Run the service using package.json start script
CMD ["npm", "start"]