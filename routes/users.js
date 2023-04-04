var express = require('express');
const { password } = require('../db/dbconfig');
var router = express.Router();
var path = require('path');      // útvonalhoz
var fs = require('fs');
const fetch = require("node-fetch");


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
  res.render('login', { loginError: false, loggedIn: false, permission: permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
});

router.post('/login', async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  const resultElements = await Db.VerifyUser(username, password);

  if (resultElements.length == 0)
    res.render('login', { loginError: true, loggedIn: false, permission: permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  else {
    req.session.user_id = resultElements[0].id;
    req.session.name = resultElements[0].name;
    req.session.jog = resultElements[0].jog;
    if (req.session.previousURL) {
      res.redirect(req.session.previousURL);
    } else {
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
  res.render('registration', { loginError: false, loggedIn: false, permission: permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage, usedData: false, lastname: "", firstname: "", password: "", passwordAgain: "" });
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
        res.render('registration', { loginError: false, loggedIn: false, permission: permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage, usedData: true, lastname: req.body.lastname, firstname: req.body.firstname, password: password, passwordAgain: passwordAgain });
      } else {
        const registrationDB = await Db.NewUser(username, password, name, email, letters);
        req.session.user_id = registrationDB.insertId;
        req.session.name = name;
        req.session.jog = 1;
        if (req.session.previousURL) {
          res.redirect(req.session.previousURL);
        } else {
          res.redirect("/");
        }
      }
    }

  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

router.get('/accounts', async function (req, res, next) {
  if (req.session.jog < 10 || !req.session.user_id) {
    res.redirect("/");
  } else {
    loggedIn = true;
    username = req.session.name;
    permission = req.session.jog;

    allPage = "";
    searchPage = "";
    loginPage = "";
    const resultElements = await Db.AllUsers();
    res.render('accounts', { list: resultElements, loggedIn: loggedIn, permission: permission, username: username, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  }
});

router.get('/profile', async function (req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/user/login");
  } else {
    loggedIn = true;
    username = req.session.name;
    permission = req.session.jog;

    allPage = "";
    searchPage = "";
    loginPage = "";
    const resultElements = await Db.SelectUser(req.session.user_id);
    res.render('profile', { list: resultElements, loggedIn: loggedIn, permission: permission, username: username, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  }
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
      username = req.session.name;
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
      res.render('favourites', { list: resultElements, loggedIn: loggedIn, permission: permission, username: username, allPage: allPage, searchPage: searchPage, loginPage: loginPage }); // template
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
  } else {
    loggedIn = true;
    username = req.session.name;
    permission = req.session.jog;

    allPage = "";
    searchPage = "";
    loginPage = "";
    const resultElements = await Db.SelectUser(req.session.user_id);
    res.render('editProfile', { loggedIn: loggedIn, passwordError : false, permission: permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage, lastname: resultElements[0].name.split(" ")[0], firstname: resultElements[0].name.split(" ")[1], email: resultElements[0].email, usernameForm : resultElements[0].username,username: username });
  }
});

router.post('/edit', async function (req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/user/login");
  } else {
    loggedIn = true;
    username = req.session.name;  //USERNMAE HIBA
    permission = req.session.jog;
    allPage = "";
    searchPage = "";
    loginPage = "";
    let password = req.body.password;
    let name = req.body.lastname + " " + req.body.firstname
    let email = req.body.email;
    let usernameForm = req.body.username;
    let verifyUser = await Db.VerifyUserById(req.session.user_id, password);
    if(verifyUser.length == 0){
      const resultElements = await Db.SelectUser(req.session.user_id);
      res.render('editProfile', { loggedIn: loggedIn, passwordError : true, permission: permission, allPage: allPage, searchPage: searchPage, loginPage: loginPage, lastname: resultElements[0].name.split(" ")[0], firstname: resultElements[0].name.split(" ")[1], email: resultElements[0].email,usernameForm : resultElements[0].username, username: username });
    }else{
      await Db.EditUser(name, email, usernameForm, req.session.user_id);
      res.redirect('/user/edit');
    }
  }
});



router.post('/addFavourite', async (req, res, next) => {
  try {
    if (req.session.user_id) {
      loggedIn = true;
      username = req.session.name;
      await Db.NewFavorite(req.session.user_id, req.body.carId);
      res.redirect(req.session.previousURL);
    } else {
      loggedIn = false;
      req.session.previousURL = ("/car/" + req.body.carId)
      res.redirect("/user/login");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/removeFavourite', async (req, res, next) => {
  try {
    if (req.session.user_id) {
      loggedIn = true;
      username = req.session.name;
      permission = req.session.jog;
      await Db.RemoveFavorite(req.session.user_id, req.body.carId);
      res.redirect("/user/favourites");
    } else {
      loggedIn = false;
      req.session.previousURL = ("/car/" + req.body.carId)
      res.redirect("/user/login");
    }


  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/reset-password', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect("/");
  }
  allPage = "";
  searchPage = "";
  loginPage = "active";
  res.render('getEmail', { loggedIn: false, emailError: false, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
});

router.post('/reset-password', async function (req, res, next) {
  let email = req.body.email;

  const emailUsed = await Db.CheckEmail(email);

  if (emailUsed.length == 0)
    res.render('getEmail', { loggedIn: false, emailError: true, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  else {
    let password = Math.random().toString(36).slice(-10);
    await Db.NewPassword(email, password);
    var data = {
      service_id: 'carmarket_gmail_service',
      template_id: 'template_i4cmwzs',
      user_id: '6JdIh-W2Ey7BNcjAN',
      template_params: {
        to_name: emailUsed[0].name,
        password: password,
        to_mail: email
      }
    };
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'origin' : 'https://localhost',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((error) => {
      console.log('ERROR: ' + error.statusText);
    });
    res.render('emailSent', { email: email, loggedIn: false, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  }
});


router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;