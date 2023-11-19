# Use an official Node.js runtime as a parent image
FROM node:16.16.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Copy the rest of your application code to the container
COPY . .

# Install application dependencies
RUN yarn

# Rebuild bcrypt package from source
RUN yarn rebuild bcrypt --build-from-source

# Build your TypeScript code
RUN yarn run build

# Expose the port your application will listen on
EXPOSE 4000

# Start your application
CMD ["node", "dist/index.js"]