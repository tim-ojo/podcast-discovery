#!/usr/bin/env python3

# import requests
import asyncio
import aiohttp
import datetime
import feedparser
from datetime import timedelta
from time import mktime
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient()
db = client['podcast-discovery']

TIMEOUT = 180  # seconds
work_queue = []
pdc_oid = None

def getCrawlerOid():
    res = db.users.find_one({"displayName":"pd_crawler"})
    return res['_id']

async def addPodcastsToWorkQ(session):
    async def searchItunesForTerm (searchTerm, session):
        params = {'term' : searchTerm, 'entity' : 'podcast', 'attribute' : 'descriptionTerm', 'limit': '200'}
        async with session.get('https://itunes.apple.com/search', params=params) as resp:
            respJson = await resp.json()
            podcast_results = respJson["results"]
            print('Number of podcast results in this call: {}'.format(len(podcast_results)))

            for podcast_result in podcast_results:
                releaseDate = datetime.datetime.now() - timedelta(days=731) # default to a date more than 2 years back, so that it can be skipped if not found
                if podcast_result.get("releaseDate") is not None:
                    releaseDate = datetime.datetime.strptime(podcast_result["releaseDate"], "%Y-%m-%dT%H:%M:%SZ")

                existing = db.resources.find_one({ "feedUrl" : podcast_result["feedUrl"] })

                if existing is None and "Technology" in podcast_result["genres"] and releaseDate > (datetime.datetime.now() - timedelta(days=731)):
                    work_queue.append(podcast_result)
                    print('adding to work_queue: {}'.format(podcast_result['trackName']))

    searchTerms = ['javascript', 'python', 'ruby', 'microsoft', 'objective+c', 'mobile+development', 'software+development', 'java', 'php', 'devops', 'angularjs', 'front+end+development', 'debug', 'reactjs', 'programming+language', 'node', 'asp.net', 'iot', 'machine+learning']

    res, _ = await asyncio.wait([ searchItunesForTerm(searchTerm, session) for searchTerm in searchTerms ])

async def processWorkQ():
    async def readRSSAndStore(podcast_result):
        podcast_feed = await asyncio.wait_for(aiohttp.get(podcast_result['feedUrl']), TIMEOUT)
        podcast_feed_xml = await podcast_feed.text()
        parsed_feed = feedparser.parse(podcast_feed_xml)

        if parsed_feed.channel.get('language') is not None and parsed_feed.channel.language.lower() != 'en-us' and parsed_feed.channel.language.lower() != 'en':
            return

        print('Downloaded RSS Feed for {} from {}. Number of entries is {}'.format(podcast_result['trackName'], podcast_result['feedUrl'], len(parsed_feed.entries)))

        lastPublishDate = datetime.datetime.utcnow()
        if parsed_feed.channel.get('published_parsed') is not None:
            lastPublishDate = datetime.datetime.fromtimestamp(mktime(parsed_feed.channel.published_parsed))
        elif parsed_feed.channel.get('updated_parsed') is not None:
            lastPublishDate = datetime.datetime.fromtimestamp(mktime(parsed_feed.channel.updated_parsed))

        # insert resource into Mongo
        result = db.resources.insert_one(
            {
                "title" : podcast_result["trackName"],
                "subtitle" : parsed_feed.channel.get('subtitle'),
                "type" : "podcast-audio",
                "url" : parsed_feed.channel.get('link', ''),
                "artworkUrl" : podcast_result["artworkUrl600"],
                "feedUrl" : podcast_result['feedUrl'],
                "description" : parsed_feed.channel.get('summary'),
                "lastPublishDate" : lastPublishDate,
                "authors" : [ parsed_feed.channel.get('author') ],
                "createdBy" : pdc_oid,
                "createdOn" : datetime.datetime.utcnow(),
                "lastModifiedOn" : datetime.datetime.utcnow(),
                "entryCount" : len(parsed_feed.entries)
            }
        )
        print('inserted {}'.format(result.inserted_id))

        # in a loop, insert entries into Mongo
        for entry in parsed_feed.entries:
            enclosure = None
            if entry.get('links') is not None:
                lastLink = len(entry.links) - 1
                enclosure = entry.links[lastLink]['href']
            try:
                db.entries.insert_one({
                    "title" : entry.title,
                    "resourceId" : result.inserted_id,
                    "enclosure" : enclosure,
                    "pubDate" : datetime.datetime.fromtimestamp(mktime(entry.published_parsed)),
                    "description" : entry.get('summary'),
                    "authors" : [entry.get('author')]
                })
            except Exception as e:
                pass

    res, _ = await asyncio.wait([ readRSSAndStore(podcast_result) for podcast_result in work_queue ])

if __name__ == '__main__':

    pdc_oid = getCrawlerOid()

    loop = asyncio.get_event_loop()

    # crawl web, add podcasts to work_queue
    with aiohttp.ClientSession(loop=loop) as session:
        loop.run_until_complete(addPodcastsToWorkQ(session))
        print('length of work_queue: {}'.format(len(work_queue)))

    # dedup the work_queue
    work_queue = list({item['feedUrl']:item for item in work_queue}.values())
    print('length of deduped work_queue: {}'.format(len(work_queue)))

    # process the work_queue
    loop.run_until_complete(processWorkQ())


# resp = requests.get("https://itunes.apple.com/search?term=javascript&entity=podcast&attribute=descriptionTerm&limit=12")
# if resp.status_code == 200:
#     print("num results: {}".format(resp.json()["resultCount"]))
#     podcasts = resp.json()["results"]
#     #print(podcasts)
#     print(podcasts[0]["collectionName"])
