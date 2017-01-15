# Build:
# docker build -t podcastdiscovery.app .
#
# Run:
# docker run -it podcastdiscovery.app
#
# Compose:
# docker-compose up -d

FROM ubuntu:16.04

# 80 = HTTP, 443 = HTTPS, 3000 = MEAN.JS server, 35729 = livereload, 8080 = node-inspector
EXPOSE 80 443 3000 35729 8080

# Set development environment as default
ENV NODE_ENV development

#RUN echo "deb http://archive.ubuntu.com/ubuntu/ $(lsb_release -sc) main universe" >> /etc/apt/sources.list

# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq \
 nano \
 tar \
 wget \
 curl \
 git \
 ssh \
 gcc \
 make \
 build-essential \
 libkrb5-dev \
 dialog \
 net-tools \
 sudo \
 apt-utils \
 software-properties-common \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN add-apt-repository universe

RUN apt-get -yqq update

RUN apt-get install -y python python3 python3-pip python-pip

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install MEAN.JS Prerequisites
RUN npm install --quiet -g grunt-cli bower yo mocha karma-cli pm2 && npm cache clean

RUN mkdir -p /opt/podcastdiscovery/public/lib
WORKDIR /opt/podcastdiscovery

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json /opt/podcastdiscovery/package.json
RUN npm install --quiet && npm cache clean

# Install bower packages
COPY bower.json /opt/podcastdiscovery/bower.json
COPY .bowerrc /opt/podcastdiscovery/.bowerrc
RUN bower install --quiet --allow-root --config.interactive=false

COPY . /opt/podcastdiscovery

# Run MEAN.JS server
CMD npm install && npm start

