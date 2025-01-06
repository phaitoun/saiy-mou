# Stage 1: Build Stage
FROM node:18.17 AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install the dependencies (include dev dependencies in this stage)
RUN npm install


RUN npx playwright install-deps  webkit
RUN npx playwright install  webkit

# Copy the rest of the application code to the container
COPY . ./
RUN npx prisma generate

# Expose the port the app will run on
EXPOSE 8000

# Command to run the application
CMD ["node", "server.js"]
