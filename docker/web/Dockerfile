FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

# Copy source code
COPY . .

# Build packages
RUN npm run build --workspace=packages/shared

# Build web app
RUN npm run build --workspace=apps/web

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"] 