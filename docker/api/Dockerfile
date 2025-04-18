FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/workflows/package*.json ./packages/workflows/

RUN npm install

# Copy source code
COPY . .

# Build packages
RUN npm run build --workspace=packages/database
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/workflows

# Build API
RUN npm run build --workspace=apps/api

EXPOSE 3001

CMD ["npm", "run", "start:dev", "--workspace=apps/api"] 