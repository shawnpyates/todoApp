"use strict";
const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.get("/", (req, res) => {
    knex
  });
  router.post("/", (req, res) => {
    knex
  });

  router.put("/", (req, res) => {
    knex
  });
  
  router.delete("/", (req, res) => {
    knex
  });

  return router;
}
