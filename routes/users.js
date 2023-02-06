var express = require('express');
const { password } = require('../db/dbconfig');
var router = express.Router();
var path = require('path');      // útvonalhoz


var Db = require('../db/dboperation');


let allPage = "";
let searchPage = "";
let loginPage = "";

router.get('/login', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect("/");
  }
  allPage = "";
  searchPage = "";
  loginPage = "active";
  res.render('login', { loginError: false, loggedIn: false, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
});

router.post('/login', async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  const resultElements = await Db.VerifyUser(username, password);

  if (resultElements.length == 0)
    res.render('login', { loginError: true, loggedIn: false, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  else {
    req.session.user_id = resultElements[0].id;
    req.session.name = resultElements[0].name;
    req.session.jog = resultElements[0].jog;
    res.redirect('/');
  }
});

router.get('/registration', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect("/");
  }
  allPage = "";
  searchPage = "";
  loginPage = "active";
  res.render('registration', { loginError: false, loggedIn: false, allPage: allPage, searchPage: searchPage, loginPage: loginPage, usedData: false, lastname : "", firstname : "", password : "", passwordAgain : ""  });
});

router.post('/registration', async function (req, res, next) {
  try {
    allPage = "";
    searchPage = "";
    loginPage = "active";
    let name = req.body.lastname + " " + req.body.firstname;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let passwordAgain = req.body.passwordAgain;
    let letters = req.body.letters;
    if (letters == "on") {
      letters = 1;
    } else {
      letters = 0;
    }
    if (password != passwordAgain) {
      res.redirect('/user/registration');
    } else {
      const resultElements = await Db.CheckUsed(username, email);
      if (resultElements.length > 0) {
        res.render('registration', { loginError: false, loggedIn: false, allPage: allPage, searchPage: searchPage, loginPage: loginPage, usedData: true, lastname : req.body.lastname, firstname : req.body.firstname, password : password, passwordAgain : passwordAgain });
      } else {
        const registrationDB = await Db.NewUser(username, password, name, email, letters);
        req.session.user_id = registrationDB.insertId;
        req.session.name = name;
        req.session.jog = 1;
        res.redirect('/');
      }
    }

  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


//CONCAT('*', UPPER(SHA1(UNHEX(SHA1('mypass')))))



module.exports = router;