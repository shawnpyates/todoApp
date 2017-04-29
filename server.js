"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const methodOverride = require('method-override');
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
// define data route
const tasksRoutes = require("./routes/tasks");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

// use cookie-session
app.use(cookieSession({
  name: 'session',
  keys: ["agdhsg3476"]
}));

app.use(flash());
// use method override using query value
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/tasks", tasksRoutes(knex));

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/", (req, res) => {
  res.status(201).send();
});
app.put("/", (req, res) => {
  res.status(201).send();
});
app.delete("/", (req, res) => {
  res.status(201).send();
});
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
app.post("/login", (req, res) => {
  const findUserByEmail = knex("users")
    .select("id", "password")
    .where({email: req.body.email})
    .limit(1);
  findUserByEmail.then((rows) => {
    const user = rows[0];
    if (!user) {
      return Promise.reject({
        type: 409,
        message: "bad credentials"
      });
    }
    const comparePasswords = bcrypt.compare(req.body.password, user.password);
    return comparePasswords.then((passwordsMatch) => {
      if (!passwordsMatch) {
        return Promise.reject({
          type: 409,
          message: "bad credentials"
        });
      }
      return Promise.resolve(user);
    });
  }).then((user) => {
    req.session.user_id = user.id;
    res.redirect("/");
  }).catch((err) => {
    req.flash("errors", err.message);
    res.redirect("/login");
  });
});
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    req.flash("errors", "email and password are required");
    res.redirect("/login");
    return;
  }
  const findRequestedEmail = knex("users")
    .select(1)
    .where({email: req.body.email})
    .limit(1);
  findRequestedEmail.then((rows) => {
    if (rows.length) {
      return Promise.reject({
        type: 409,
        message: "email has already been used"
      });
    }
    return bcrypt.hash(req.body.password, 10);
  }).then((passwordDigest) => {
    return knex("users").insert({
      email: req.body.email,
      password: passwordDigest
    });
  }).then(() => {
    req.flash("info", "account successfully created");
    res.redirect("/");
  }).catch((err) => {
    req.flash("errors", err.message);
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
