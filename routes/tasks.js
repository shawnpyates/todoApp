"use strict";
const queryApi = require("../api/queryApi");
const apiTypes = require("../api/apiTypes");

function getCategory(results) {
  return new Promise ((resolve, reject) => {
    console.log("RESULTS FROM getCategory:  ", results);
    let imdb = results.booleans[0];
    let gBooks = results.booleans[1];
    let zomato = results.booleans[2];
    let walmart = results.booleans[3];
    if (imdb && !gBooks && !zomato) {
      // console.log("CATEGORY 1 MATCH");
      // return 1;
      results.category = 1;
    } else if (!imdb && gBooks && !zomato) {
      // console.log("CATEGORY 2 MATCH");
      // return 2;
      results.category = 2;
    } else if (zomato) {
      // console.log("CATEGORY 3 MATCH");
      // return 3;
      results.category = 3;
    } else if (!imdb && !gBooks && !zomato) {
      if (walmart) {
        // console.log("CATEGORY 4 MATCH");
        // return 4;
        results.category = 4;
      } else {
        results.category = 6;
      }
    } else if (imdb && gBooks && !zomato) {
      // console.log("CATEGORY 5 MATCH");;
      // return 5;
      results.category = 5;
    }
    // } else {
    //   // console.log("CATEGORY 6 MATCH");
    //   // return 6;
    //   results.category = 6;
    // }
    resolve(results);
  });
}


const toWatch = ["watch","see"];
const toRead = ["read"]
const toEat = ["eat", "go", "food", "grab"]
const toBuy = ["buy", "get", "shop","purchase", "shopping"];

function findOne(input, target, categories_id) {
 let catID = 0;
 console.log("INPUT: ", input, "TARGET: ", target);
 for (var i = input.length - 1; i >= 0; i--) {
   for (var j = target.length - 1; j >= 0; j--) {
      if (input[i].toLowerCase() === target[j].toLowerCase()) {
        return true;
      }
   }
 }
}

function getLink(results) {
  return new Promise ((resolve, reject) => {
    console.log("--------RESULTS FROM IN getLink---------", results);
    let linkID = "";
    switch (results.category) {
      case 1:
        linkID = apiTypes.imdb.id;
        break;
      case 2:
        linkID = apiTypes.gBooks.id;
        break;
      case 3:
        linkID = apiTypes.zomato.id;
        break;
      case 4:
        linkID = apiTypes.walmart.id;
        break;
      default:
        linkID = "";
    }
    if (linkID) {
    // results.linkID = linkID;
      queryApi.getMessage(linkID, results.item, "link", function(link){
        results.link = link;
        resolve(results);
      });
    } else {
      results.link = null;
      resolve(results);
    }
  });
}

// function getLink(results) {
//   return new Promise ((resolve, reject) => {
//     queryApi.getMessage(results.linkID, results.item, "link", function(link) {
//       results.link = link;
//     })
//   })
// }

    // queryApi.getMessage(linkID, results.item, "link", function(link){
    //   results.link = link;

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.get("/", (req, res) => {
    console.log("GET is hit");
    knex
    .select("*")
      .from("tasks")
      .then((results) => {
        console.log("Result", results);
        res.json(results);
    });
  });



  router.post("/", (req, res) => {
      console.log("--------------",findOne(req.body.name.split(" "), toWatch, 1));
    let catID =0;
    if (findOne(req.body.name.split(" "), toWatch, 1)) {
      catID = 1;
    } else if (findOne(req.body.name.split(" "), toRead, 2)) {
      catID = 2;
    } else if (findOne(req.body.name.split(" "), toEat, 3)) {
      catID = 3;
    } else if (findOne(req.body.name.split(" "), toBuy, 4)) {
      catID = 4;
    }
    console.log("-------------VALUE OF CATID------------", catID);
    if (catID) {
      knex('tasks').insert({ task_name: req.body.name, categories_id: catID })
      .then(() =>  { res.status(201).send(); })
      return;
    } else {
    function insertData(results) {
      if (!results.category) {
        results.category = null;
      }
      console.log("------TOTAL RESUTS------", results);
      knex('tasks').insert({ task_name: req.body.name, categories_id: results.category })
      // we also want to insert { link: results.link }
      .then(() =>  { res.status(201).send(); })
     }
    // console.log("post is hit");
    // console.log("Input recieved is", req.body.name);
    queryApi.findInApi(req.body.name).then(getCategory).then(getLink).then(insertData);
  }
});


  router.put("/:id", (req, res) => {
    //knex
    console.log("Put is hit");
    console.log("Inputs recieved", req.body.id, req.body.cat_id);
    knex('tasks').where('id',req.body.id).update('categories_id', req.body.cat_id)
      .then(() => {res.status(200).json({ok: true}); });
  });

  router.delete("/:id", (req, res) => {
    console.log("ID is ", req.params.id);
    knex('tasks').where('id',req.params.id).del()
      .then(() => {res.status(200).json({ok: true}); });
  });

  return router;
}

