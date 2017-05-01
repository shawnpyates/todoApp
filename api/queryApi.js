// const arg = process.argv.slice(2);
// const searchItem = arg.join(" ");
const https = require("https");
const apiTypes = require("./apiTypes");



function generateQueryUrl(searchID, item) {
  console.log(`https://www.googleapis.com/customsearch/v1?key=${apiTypes.apiKey}&cx=${searchID}&q=${item}`);
  return `https://www.googleapis.com/customsearch/v1?key=${apiTypes.apiKey}&cx=${searchID}&q=${item}`;
}

function findValue(file, outerKey, innerKey) {
  return file[outerKey][0][innerKey];
}


// connect to API and parse JSON so that it can be queried
const getMessage = (searchType, item, key1, key2, cb) => {
  //in this case, key must be "title"
  if (searchType === apiTypes.zomato.id) {
    item += " vancouver";
  }
  const queryUrl = generateQueryUrl(searchType, item);
  return https.get(queryUrl, response => {
    if (response.statusCode === 200){
      let body = "";
      console.log(`----CONNECTED HERE WITH ${searchType} AND ${key1}----`);
      response.on('data', data => {
        body += data.toString();
      });
      response.on('end', () => {
        const page  = JSON.parse(body);
        if (page.hasOwnProperty("items")) {
          console.log("HERE'S THE FOCUS KEY1: ", key1);
          const value1 = findValue(page, "items", key1);
          if (key2) {
            const value2 = findValue(page, "items", key2);
            cb(value1, value2);
          } else {
            cb(value1);
          }
        } else {
          cb("");
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
  getMessage(type.id, searchItem, "title", null, function(searchTitle) {
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
  return new Promise ((resolve, reject) => {
    let imdbPromise = new Promise ((resolve, reject) => {
      getSplitMessage(searchItem, apiTypes.imdb, function(splitMessages){
      console.log("IMDB SPLIT STRING: ", splitMessages[0].toLowerCase());
      if (splitMessages[0].toLowerCase() === `${searchItem} `.toLowerCase()) {
        resolve(true);
      } else {
        resolve(false);
      }
      });
    });
    let gBooksPromise = new Promise ((resolve, reject) => {
      getSplitMessage(searchItem, apiTypes.gBooks, function(splitMessages){
        console.log("GBOOKS SPLIT STRING: ", splitMessages[0].toLowerCase());
        if (splitMessages[0].toLowerCase() === `${searchItem} `.toLowerCase()) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    let zomatoPromise = new Promise ((resolve, reject) => {
      getSplitMessage(searchItem, apiTypes.zomato, function(splitMessages){
        console.log("ZOMATO SPLIT STRING 0: ", splitMessages[0].toLowerCase());
        console.log("ZOMATO SPLIT STRING 1: ", splitMessages[1].toLowerCase());
        if (splitMessages[0].toLowerCase() === `${searchItem}`.toLowerCase() ||
            splitMessages[1].toLowerCase() === `${searchItem} `.toLowerCase() ||
            splitMessages[0].toLowerCase() === `${searchItem} menu`.toLowerCase())
        {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    let walmartPromise = new Promise ((resolve, reject) => {
      getSplitMessage(searchItem, apiTypes.walmart, function(splitMessages){
        console.log("WALMART MESSAGE: ", splitMessages[0].toLowerCase());
        console.log("WALMART SPLIT STRING: ", splitMessages[0].toLowerCase());
        if (apiTypes.walmart.message.toLowerCase().includes(searchItem.toLowerCase()) &&
            splitMessages[0] !== "Walmart") {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    Promise.all([imdbPromise, gBooksPromise, zomatoPromise, walmartPromise]).then(values =>
      resolve({ booleans: values, item: searchItem }));
  });
}




module.exports.findInApi = findInApi;
module.exports.getMessage = getMessage;





