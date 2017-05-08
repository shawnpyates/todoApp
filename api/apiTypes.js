require('dotenv').config();

module.exports = {

  apiKey: process.env.API_KEY ,

  imdb: {
    id: process.env.IMDB_ID,
    splitters: ["("],
  },
 gBooks: {
    id: process.env.GBOOKS_ID,
    splitters: ["-"],
  },
 zomato: {
    id: process.env.ZOMATO_ID,
    splitters: [",", "-"],
  },

  walmart: {
    id: process.env.WALMART_ID,
    splitters: [","],
  }

};
