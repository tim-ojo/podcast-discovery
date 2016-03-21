
import feedparser
import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
from time import mktime

client = MongoClient()
db = client['podcast-discovery']

cursor = db.resources.find()
for podcast in cursor:
    if podcast.get('feedUrl') is not None:
        parsed_feed = feedparser.parse(podcast['feedUrl'])

        lastPublishDate = datetime.datetime.utcnow()
        if parsed_feed.channel.get('published_parsed') is not None:
            lastPublishDate = datetime.datetime.fromtimestamp(mktime(parsed_feed.channel.published_parsed))
        elif parsed_feed.channel.get('updated_parsed') is not None:
            lastPublishDate = datetime.datetime.fromtimestamp(mktime(parsed_feed.channel.updated_parsed))

        db.resources.update_one( {'_id': podcast['_id']}, {'$set': {'lastPublishDate': lastPublishDate}}, upsert=False)

        for entry in parsed_feed.entries:
            enclosure = None
            if entry.get('links') is not None:
                lastLink = len(entry['links']) - 1
                enclosure = entry['links'][lastLink]['href']

            try:
                res = db.entries.insert_one({
                    "title" : entry['title'],
                    "resourceId" : podcast['_id'],
                    "enclosure" : enclosure,
                    "pubDate" : datetime.datetime.fromtimestamp(mktime(entry['published_parsed'])),
                    "description" : entry.get('summary'),
                    "authors" : [entry.get('author')]
                })
                print('Inserted new entry: <{} [{}]> for podcast <{} [{}]>'.format(entry['title'], res.inserted_id, podcast['title'], podcast['_id']))
            except Exception as e:
                print('Did not insert entry: {} for podcast {} [{}]'.format(entry['title'], podcast.get('title'), podcast['_id']))
