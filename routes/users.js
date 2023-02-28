var express = require('express');
const { password } = require('../db/dbconfig');
var router = express.Router();
var path = require('path');      // útvonalhoz
var fs = require('fs');


var Db = require('../db/dboperation');

let permission = 0;

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
  res.render('login', { loginError: false, loggedIn: false, permission : permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
});

router.post('/login', async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  const resultElements = await Db.VerifyUser(username, password);

  if (resultElements.length == 0)
    res.render('login', { loginError: true, loggedIn: false, permission : permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  else {
    req.session.user_id = resultElements[0].id;
    req.session.name = resultElements[0].name;
    req.session.jog = resultElements[0].jog;
    if(req.session.previousURL){
      res.redirect(req.session.previousURL);
    }else{
      res.redirect("/");
    }
    
  }
});

router.get('/registration', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect("/");
  }
  allPage = "";
  searchPage = "";
  loginPage = "active";
  res.render('registration', { loginError: false, loggedIn: false, permission : permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage, usedData: false, lastname : "", firstname : "", password : "", passwordAgain : ""  });
});

router.get('/accounts', async function (req, res, next) {
  if (req.session.jog < 10 || !req.session.user_id) {
    res.redirect("/");
  }else{
    loggedIn = true;
    userName = req.session.name;
    permission = req.session.jog;

    allPage = "";
    searchPage = "";
    loginPage = "";
    const resultElements = await Db.AllUsers();
    res.render('accounts', {list : resultElements, loggedIn: loggedIn, permission : permission, userName: userName, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  }
});

router.get('/profile', async function (req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/user/login");
  }else{
    loggedIn = true;
    userName = req.session.name;
    permission = req.session.jog;

    allPage = "";
    searchPage = "";
    loginPage = "";
    const resultElements = await Db.SelectUser(req.session.user_id);
    res.render('profile', {list : resultElements, loggedIn: loggedIn, permission : permission, userName: userName, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  }
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
        res.render('registration', { loginError: false, loggedIn: false, permission : permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage, usedData: true, lastname : req.body.lastname, firstname : req.body.firstname, password : password, passwordAgain : passwordAgain });
      } else {
        const registrationDB = await Db.NewUser(username, password, name, email, letters);
        req.session.user_id = registrationDB.insertId;
        req.session.name = name;
        req.session.jog = 1;
        if(req.session.previousURL){
          res.redirect(req.session.previousURL);
        }else{
          res.redirect("/");
        }
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

router.get('/favourites', async (req, res, next) => {
  try {
    let files;
    let okindex;
    req.session.previousURL = "/user/favourites";
    allPage = "";
    searchPage = "";
    loginPage = "";
    if (req.session.user_id) {
      loggedIn = true;
      userName = req.session.name;
      permission = req.session.jog;
      const resultElements = await Db.Favorites(req.session.user_id);
      for (let i = 0; i < resultElements.length; i++) {
        files = fs.readdirSync(path.join(__dirname, '../public/src/database/img/' + resultElements[i].id));
        for (let j = 0; j < files.length; j++) {
          if (files[j].startsWith("index")) {
            okindex = j;
          }
        }
        files = files.slice(okindex, okindex + 1);
        resultElements[i].indexkep = files[0];
      }
      res.render('favourites', { list: resultElements, loggedIn: loggedIn, permission : permission, userName: userName, allPage: allPage, searchPage: searchPage, loginPage: loginPage }); // template
    } else {
      loggedIn = false;
      res.redirect("/user/login");
    }

  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

router.get('/edit', async function (req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/user/login");
  }else{
    loggedIn = true;
    userName = req.session.name;
    permission = req.session.jog;

    allPage = "";
    searchPage = "";
    loginPage = "";
    const resultElements = await Db.SelectUser(req.session.user_id);
    res.render('editProfile', {loggedIn: loggedIn, permission : permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage, lastname : resultElements[0].name.split(" ")[0], firstname : resultElements[0].name.split(" ")[1], email : resultElements[0].email, username : resultElements[0].username});
  }
});


//CONCAT('*', UPPER(SHA1(UNHEX(SHA1('mypass')))))



module.exports = router;
