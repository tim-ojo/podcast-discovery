# Podcast Discovery

Podcast Discovery is a web application that allows the user to find and learn about new podcasts and episodes they might be interested in based on search. This initial version of Podcast Discovery (PD) is solely focused on developer podcasts.

The current model for consuming podcasts is to subscribe to a podcaster's feed. However, there is a discoverability problem that is not addressed by this model. If I would like to find a podcast episode that talks about Scala or that features Bob Martin, I don't have a way of doing that. PD aims to solve that problem by giving you powerful episode level search across hundreds of podcasts from a simple interface.

Check it out at [apps.timojo.com/podcastdiscovery](http://apps.timojo.com/podcastdiscovery)

## How it works

Podcast Discovery's UI and backend service is built on the MEAN framework. There are also Python scripts for discovery and analysis.

- We do a description / keyword search of iTunes for developer podcasts, filter the results, and import them into our DB
- We get RSS feeds and download the metadata for the podcast episodes
- Both the podcast metadata and episode metadata get analyzed for keywords and stored in both MongoDB (our main datastore) and indexed in Elasticsearch 


## To Do
- Content-based recommendation engine to recommend other podcasts based on the current podcast
- UI Enhancements like Social Sharing, etc.
- Expansion to include other types of podcasts (not just developer podcasts) and other mediums like Youtube channels or blogs.


## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
