# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/.env ./

RUN yarn install --production --frozen-lockfile

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["yarn", "start"]