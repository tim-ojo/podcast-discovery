
import re
import nltk
import concurrent.futures
import wikipedia
from pymongo import MongoClient
from bson.objectid import ObjectId
from html.parser import HTMLParser
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from collections import Counter, defaultdict
from operator import itemgetter
from elasticsearch import Elasticsearch

client = MongoClient()
db = client['podcast-discovery-dev']
es = Elasticsearch()

tokenizer = RegexpTokenizer(r'\w+')

wikipediaset = set()
def loadWikipediaSet():
    wikipediaset = set([line.rstrip('\n') for line in open('wikipedia/wikipedia-1.txt')])
    wikipediaset = wikipediaset | set([line.rstrip('\n') for line in open('wikipedia/wikipedia-2.txt')])
    wikipediaset = wikipediaset | set([line.rstrip('\n') for line in open('wikipedia/wikipedia-3.txt')])

    podcast_stopwords = ['episode', 'show', 'week', 'today', 'talk', 'talks', 'talked', 'discuss', 'guys', 'guest', 'joined', 'joining', 'welcome', 'also', 'asks', 'much', 'listen', 'download', 'notes', 'podcast']

    return wikipediaset.difference(podcast_stopwords)

# Function to removeHtml
class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

def removeStopWords(wordList):
    return [word for word in wordList if word not in stopwords.words('english')]

def removeNumbers(wordList):
    return [word for word in wordList if not word.isdigit()]

def removeHtml(text):
    return re.sub(r'<[^<]+?>', '', text)

def createWordPairs(wordList):
    prevWord = ''
    wordPairList = []
    for word in wordList:
        if prevWord != '':
            wordPairList.append('{} {}'.format(prevWord, word))
        prevWord = word

    return wordPairList

def isValidTopic(word):
    if word in wikipediaset:
        return True
    else:
        return False

def isValidTopic2(word):
    try:
        page = wikipedia.page(word)
        wikititle = page.title.lower().replace('(', '').replace(')', '')
        if wikititle.startswith(word):
            return True
        else:
            return False
    except Warning:
        return False
    except Exception:
        return False

def analyzeTopics():
    # FOR TESTING:
    # ChangeLog, ruby rogues, herding code, javascript jabber, giant robots, fragmented, from python import podcast, Frontflip, Full stack radio
    oids = [ObjectId("56d1316fd1e2c5262bb87a4a"), ObjectId("56d131c7d1e2c5262bb89051"), ObjectId("56d131eed1e2c5262bb89883"), ObjectId("56d131f9d1e2c5262bb89ba8"), ObjectId("56d1320cd1e2c5262bb8a2e7"), ObjectId("56d13170d1e2c5262bb87bb8"), ObjectId("56d13142d1e2c5262bb86862"), ObjectId("56d131c0d1e2c5262bb88fb1"), ObjectId("56d1317dd1e2c5262bb87ff5")]

    podcast_topics = {}
    podcast_entry_cnt = defaultdict(int)
    global_topic_cnt = Counter()

    #cursor = db.entries.find({'resourceId': {'$in' : oids} });
    cursor = db.entries.find()
    for entry in cursor:
        podcast_entry_cnt[str(entry.get('resourceId'))] += 1
        summary = entry.get('description')
        topics = []
        if summary is not None:
            if entry.get('topics') is None:
                plain_summary = strip_tags(summary)
                allwords = tokenizer.tokenize(plain_summary.lower())
                filtered_words = removeStopWords(allwords)
                bagOfWords = removeNumbers(filtered_words)
                bagOfWordPairs = createWordPairs(bagOfWords)
                bagOfWords = bagOfWords + bagOfWordPairs

                for word in bagOfWords:
                    if isValidTopic(word):
                        topics.append(word)
                        podcast_topics.setdefault(str(entry.get('resourceId')),[]).append(word)

                #topicCounts = Counter(topics)
                #print('[{}]: \n{}'.format(entry.get('title'), topicCounts ))

                # Do update: Write topics to db.entries
                db.entries.update_one( { "_id": entry.get('_id') },
                    { "$set": { "topics" : topics } } )
                # Do update: Write topics to es.entry
                esdoc = {'title': entry.get('title'), 'topics': topics}
                es.index(index="podcast-discovery", doc_type="entry", id=str(entry.get('_id')), body=esdoc)
            else:
                topics = entry.get('topics')
                for topic in topics:
                    podcast_topics.setdefault(str(entry.get('resourceId')),[]).append(topic)

            global_topic_cnt.update(topics)

    # for each podcast, Do update: write topic list to db.resources
    for podcast_oid, podcast_topic_list in podcast_topics.items():
        topics = []
        for topic, cnt in Counter(podcast_topic_list).most_common(50):
            topics.append({ topic : round(cnt/podcast_entry_cnt[podcast_oid],4) })

        db.resources.update_one({ "_id": ObjectId(podcast_oid) },
            { "$set": { "topics" : topics } } )

        #print(podcast_oid + ' => ')
        #print(sorted( [(topic, round(cnt/podcast_entry_cnt[podcast_oid],4)) for (topic, cnt) in Counter(podcast_topic_list).most_common(50)], key=itemgetter(1), reverse=True ))

    # get all the podcasts and insert/update in Elasticsearch
    cursor = db.resources.find()
    for res in cursor:
        topics = []
        if res.get('topics') is not None:
            for topicDict in res.get('topics'):
                for key in topicDict:
                    topics.append(key)

        esdoc = {'title' : res.get('title'), 'subtitle': res.get('subtitle'), 'description': res.get('description'), 'authors': res.get('authors'), 'topics': topics}

        es.index(index="podcast-discovery", doc_type="resource", id=str(res.get('_id')), body=esdoc)

    # Write top 100 topics to db.cache
    top_100_topics = [topic for topic, _ in global_topic_cnt.most_common(180)]
    db.cache.update( {"key": "top-100-topics"}, {"key": "top-100-topics", "value": top_100_topics}, True)

if __name__ == '__main__':
    wikipediaset = loadWikipediaSet()
    analyzeTopics()
