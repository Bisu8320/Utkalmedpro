# Use the official Node.js image
FROM node:18

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Build TypeScript (if you're using tsc to compile)
RUN npm run build

# Expose port
EXPOSE 8080

# Run the app
CMD ["node", "dist/server.js"]
