"use strict";
const queryApi = require("../api/queryApi");
const apiTypes = require("../api/apiTypes");
const express = require('express');
const router  = express.Router();

//keywords
const toWatch = ["watch","see"];
const toRead = ["read"]
const toEat = ["eat", "go", "food", "grab"]
const toBuy = ["buy", "get", "shop","purchase", "shopping"];


// before checking API, check if user input contains any matches to a hard-coded set of key words
// if there's a match, category is determined, and API is not checked
function findOne(input, target, categories_id) {
 let catID = 0;
 for (var i = input.length - 1; i >= 0; i--) {
   for (var j = target.length - 1; j >= 0; j--) {
      if (input[i].toLowerCase() === target[j].toLowerCase()) {
        return true;
      }
    }
  }
}

// we will retrieve an array of booleans from the findInApi function
// based on the combination of of booleans, we will assign a category to the task
// if a match for a restaurant in Vancouver is found,
// it will be assigned to the restaurant category, regardless of other results
// a task will only be categorized as a product if all other checks are false
function getCategory(results) {
  return new Promise ((resolve, reject) => {
    let imdb = results.booleans[0];
    let gBooks = results.booleans[1];
    let zomato = results.booleans[2];
    let walmart = results.booleans[3];
    if (imdb && !gBooks && !zomato) {
      results.category = 1;
    } else if (!imdb && gBooks && !zomato) {
      results.category = 2;
    } else if (zomato) {
      results.category = 3;
    } else if (!imdb && !gBooks && !zomato) {
      if (walmart) {
        results.category = 4;
      } else {
        results.category = 6;
      }
    } else if (imdb && gBooks && !zomato) {
      results.category = 5;
    }
    resolve(results);
  });
}

// if the task is assigned a category from 1-4,
// we will make another request to the corresponding filtered search,
// and get the link and snippet from the JSON
function getLink(results) {
  return new Promise ((resolve, reject) => {
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
      queryApi.getMessage(linkID, results.item, "link", "snippet", function(link, snippet){
        results.link = link;
        results.snippet = snippet;
        resolve(results);
      });
    } else {
      results.link = null;
      results.snippet = null;
      resolve(results);
    }
  });
}



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
    if (catID) {
      knex('tasks').insert({ task_name: req.body.name, categories_id: catID })
      .then(() =>  { res.status(201).send(); })
      return;
    } else {
    function insertData(results) {
      if (!results.category) {
        results.category = null;
      }
      knex('tasks').insert({ task_name: req.body.name, categories_id: results.category })
      // we also want to insert { link: results.link, snippet: results.snippet }
      .then(() =>  { res.status(201).send(); })
     }
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

