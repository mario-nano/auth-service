FROM node:14-alpine as builder

# Set the working directory
WORKDIR /app

# Copy the package.json file and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the source code and build the application
COPY . .

EXPOSE 81

CMD ["npm", "start"]
