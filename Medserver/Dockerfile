# Use the official Node.js image
FROM node:18

WORKDIR /app

# Copy the Medserver directory to the container
COPY Medserver ./Medserver

# Set working directory to the Medserver subdirectory
WORKDIR /app/Medserver

# Install dependencies
RUN npm install

# Build TypeScript (if you're using tsc to compile)
RUN npm run build

# Expose port
EXPOSE 8080

# Run the app
CMD ["node", "dist/server.js"]
