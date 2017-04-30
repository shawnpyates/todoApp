"use strict";
const searchCategory = require("../api/queryApi");

function finish(results) {
  console.log("RESULTS FROM FINISH:  ", results);
  let imdb = results[0];
  let gBooks = results[1];
  let zomato = results[2];
  let walmart = results[3];
  if (imdb && !gBooks && !zomato) {
    console.log("CATEGORY 1 MATCH");
    return 1;
  } else if (!imdb && gBooks && !zomato) {
    console.log("CATEGORY 2 MATCH");
    return 2;
  } else if (zomato) {
    console.log("CATEGORY 3 MATCH");
    return 3;
  } else if (!imdb && !gBooks && !zomato) {
    if (walmart) {
      console.log("CATEGORY 4 MATCH");
      return 4;
    }
  } else if (imdb && gBooks && !zomato) {
    console.log("CATEGORY 5 MATCH");;
    return 5;
  } else {
    console.log("CATEGORY 6 MATCH");
    return 6;
  }
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
    function insertData(result) {
      if (!result) {
        result = null;
      }
      knex('tasks').insert({ task_name: req.body.name, categories_id: result })
      .then(() =>  { res.status(201).send(); })
     }
    // console.log("post is hit");
    // console.log("Input recieved is", req.body.name);
    searchCategory(req.body.name).then(finish).then(insertData);
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

