# set node version
FROM node:14

# use the folder this file is in
WORKDIR .

# copy package and package-lock
COPY package*.json ./

# install dependencies - if we needed global packages like redis or gulp, we would install those in a step right before this
RUN npm install

# copy the src files
COPY . .

# expose the port we're using
EXPOSE 3000

# register the start command
CMD ["npm", "start"]

# to build: sudo docker build . -t data-fetch
# to run: sudo docker run 49160:3000 -d data-fetch
# go to localhost:49160 to see the page, or run curl -i localhost:49160 to make sure we get 200 OK back