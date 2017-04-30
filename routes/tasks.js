"use strict";
const searchCategory = require("../api/queryApi");

function finish(results) {
  let imdb = results[0];
  let gBooks = results[1];
  let zomato = results[2];
  let walmart = results[3];
  if (imdb && !gBooks && !zomato) {
    console.log(1);
    return 1;
  } else if (!imdb && gBooks && !zomato) {
    console.log(2);
    return 2;
  } else if (!imdb && !gBooks && zomato) {
    console.log(3);
    return 3;
  } else if (!imdb && !gBooks && !zomato) {
    if (walmart) {
      console.log(4);
      return 4;
    }
  } else if (imdb && gBooks && !zomato) {
    console.log(5);
    return 5;
  } else {
    console.log(6);
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
      knex('tasks').insert({ task_name: req.body.name, categories_id: result })
      .then(() =>  { res.status(201).send(); })
     }
    // console.log("post is hit");
    // console.log("Input recieved is", req.body.name);
    searchCategory(req.body.name).then(finish).then(insertData);
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

