FROM ubuntu:16.04

RUN apt-get update

RUN apt-get install -y tar git curl nano wget dialog net-tools build-essential iputils-ping

RUN apt-get install -y python3 python3-dev python3-pip

WORKDIR /opt/podcastdiscovery/scripts

COPY . /opt/podcastdiscovery/scripts

RUN pip3 install -r requirements.txt

RUN python3 -m nltk.downloader stopwords

