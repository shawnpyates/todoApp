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
  } else if (!imdb && !gBooks && zomato) {
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
    function insertData(result) {
      if (!result) {
        result = 6;
      }
      knex('tasks').insert({ task_name: req.body.name, categories_id: result })
      .then(() =>  { res.status(201).send(); })
     }
    console.log("post is hit");
    console.log("Input recieved is", req.body.name);
    searchCategory(req.body.name).then(finish).then(insertData);
});


  router.put("/", (req, res) => {
    knex
  });

  router.delete("/:id", (req, res) => {
    console.log("ID is ", req.params.id);
    knex('tasks').where('id',req.params.id).del()
      .then(() => {res.status(200).json({ok: true}); });
  });

  return router;
}

