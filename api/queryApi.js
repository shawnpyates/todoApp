const arg = process.argv.slice(2);
const searchItem = arg.join(" ");
const https = require('https');
const apiTypes = require('./apiTypes');



function generateQueryUrl(searchID, item) {
  return `https://www.googleapis.com/customsearch/v1?key=${apiTypes.apiKey}&cx=${searchID}&q=${item}`;
}


// connect to API and parse JSON so that it can be queried
const getMessage = (searchType, item, cb) => {
  if (searchType === apiTypes.zomato.id) {
    item += " vancouver";
  }
  const queryUrl = generateQueryUrl(searchType, item);
  return https.get(queryUrl, response => {
    if (response.statusCode === 200){
      let body = "";
      response.on('data', data => {
        body += data.toString();
      });
      response.on('end', () => {
        const page  = JSON.parse(body);
        const title = page.items[0].title;
        cb(title);
      });
    } else {
      console.error("Sorry, but there was a connection problem.");
    }
  });
}

// search results will usually be predictably formatted based on the site being searched
// split the result and compare specified section to the user's input
function getSplitMessage(type, cb) {
  if (!searchItem) {
    console.error("No input.");
    return;
  }
  getMessage(type.id, searchItem, function(searchTitle) {
    type.message = searchTitle;
    for (let i = 0; i < type.splitters.length; i++) {
      splitSearchTitle = searchTitle.split(type.splitters[i]);
      type.splitMessages.push(splitSearchTitle[0]);
    }
    cb(type.splitMessages);
  });
}

// since most movies are sold by Walmart, we will wait for queries to go through
// IMDB first, and if a match is found, Walmart will not be searched
// this way, when a movie title is searched, it will go into the "movies to watch" category
getSplitMessage(apiTypes.imdb, function(splitMessages){
  if (splitMessages[0].toLowerCase() === `${searchItem} `.toLowerCase()) {
    apiTypes.imdb.found = true;
  } else {
      getSplitMessage(apiTypes.walmart, function(splitMessages){
        if (splitMessages[0].toLowerCase().includes(searchItem.toLowerCase()) &&
            splitMessages[0] !== "Walmart") {
            apiTypes.walmart.found = true;
        }
        console.log("WALMART: ", apiTypes.walmart.found)
      });
  }
  console.log("IMDB: ", apiTypes.imdb.found);
});

getSplitMessage(apiTypes.gBooks, function(splitMessages){
  if (splitMessages[0].toLowerCase() === `${searchItem} `.toLowerCase()) {
    apiTypes.gBooks.found = true;
  }
  console.log("GBOOKS: ", apiTypes.gBooks.found);
});

getSplitMessage(apiTypes.zomato, function(splitMessages){
  if (splitMessages[0].toLowerCase() === `${searchItem}`.toLowerCase() ||
      splitMessages[1].toLowerCase() === `${searchItem} `.toLowerCase()) {
    apiTypes.zomato.found = true;
  }
  console.log("ZOMATO: ", apiTypes.zomato.found);
});
