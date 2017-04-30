// const arg = process.argv.slice(2);
// const searchItem = arg.join(" ");
const https = require("https");
const apiTypes = require("./apiTypes");



function generateQueryUrl(searchID, item) {
  console.log(`https://www.googleapis.com/customsearch/v1?key=${apiTypes.apiKey}&cx=${searchID}&q=${item}`);
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
        if (page.hasOwnProperty("items")) {
        const title = page.items[0].title;
        console.log("HERE'S THE TITLE:  ", title);
        cb(title);
        }
      });
    } else {
      console.error("Sorry, but there was a connection problem.");
    }
  });
}

// search results will usually be predictably formatted based on the site being searched
// split the result and compare specified section to the user's input
function getSplitMessage(searchItem, type, cb) {
  if (!searchItem) {
    console.error("No input.");
    return;
  }
  getMessage(type.id, searchItem, function(searchTitle) {
    type.message = searchTitle;
    let splitSearchArray = []
    for (let i = 0; i < type.splitters.length; i++) {
      splitSearchTitle = searchTitle.split(type.splitters[i]);
      splitSearchArray.push(splitSearchTitle[0]);
    }
    cb(splitSearchArray);
  });
}

// find if search item has matches in API for each search type
function findInApi(searchItem) {
  getSplitMessage(searchItem, apiTypes.imdb, function(splitMessages){
    console.log("IMDB SPLIT STRING: ", splitMessages[0].toLowerCase());
    if (splitMessages[0].toLowerCase() === `${searchItem} `.toLowerCase()) {
      apiTypes.imdb.found = true;
    } else {
      apiTypes.imdb.found = false;
    }
  });
  getSplitMessage(searchItem, apiTypes.gBooks, function(splitMessages){
    console.log("GBOOKS SPLIT STRING: ", splitMessages[0].toLowerCase());
    if (splitMessages[0].toLowerCase() === `${searchItem} `.toLowerCase()) {
      apiTypes.gBooks.found = true;
    } else {
      apiTypes.gBooks.found = false;
    }
  });
  getSplitMessage(searchItem, apiTypes.zomato, function(splitMessages){
    console.log("ZOMATO SPLIT STRING 0: ", splitMessages[0].toLowerCase());
    console.log("ZOMATO SPLIT STRING 1: ", splitMessages[1].toLowerCase());
    if (splitMessages[0].toLowerCase() === `${searchItem}`.toLowerCase() ||
        splitMessages[1].toLowerCase() === `${searchItem} `.toLowerCase() ||
        splitMessages[0].toLowerCase() === `${searchItem} menu`.toLowerCase())
    {
      apiTypes.zomato.found = true;
    } else {
      apiTypes.zomato.found = false;
    }
  });
  getSplitMessage(searchItem, apiTypes.walmart, function(splitMessages){
    console.log("WALMART MESSAGE: ", splitMessages[0].toLowerCase());
    console.log("WALMART SPLIT STRING: ", splitMessages[0].toLowerCase());
    if (apiTypes.walmart.message.toLowerCase().includes(searchItem.toLowerCase()) &&
        splitMessages[0] !== "Walmart") {
      apiTypes.walmart.found = true;
      console.log("------------TRUE FOR WALMART------------");
    } else {
      apiTypes.walmart.found = false;
    }
  });
}

// allow time for each search and collect values before displaying result to user
function setValues(searchItem) {
  return new Promise((resolve, reject) => {
    findInApi(searchItem);
    setTimeout(() => resolve ([apiTypes.imdb.found, apiTypes.gBooks.found, apiTypes.zomato.found, apiTypes.walmart.found]), 3000);
  });
}


module.exports = setValues;





