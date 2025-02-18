var express = require('express');
var router = express.Router();
var path = require('path');      // útvonalhoz
var fs = require('fs');

var Db = require('../db/dboperation');

var verify = require("../middleware/verifyModule");

let loggedIn = false;
let username = "";
let permission = 0;

let allPage = "";
let searchPage = "";
let loginPage = "";

function stringToMoney(raw){
  raw = raw.toString();
  let money = "";
  let count = 0;
  for(let i = raw.length - 1; i >= 0; i--){
      if(count % 3 === 0 && count!== 0){
          money = " " + money;
      }
      money = raw.charAt(i) + money;
      count++;
  }
  return money;
}

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    allPage = "";
    searchPage = "";
    loginPage = "";
    if (req.session.user_id) {
      loggedIn = true;
      username = req.session.name;
      permission = req.session.jog;
    } else {
      loggedIn = false;
    }
    let files;
    let okindex;
    pageNo = req.params.page - 1;
    if (pageNo < 0 || isNaN(pageNo)) {
      pageNo = 0;
    }
    const specials = await Db.SelectAllSpecial();
    for (let i = 0; i < specials.length; i++) {
      files = fs.readdirSync(path.join(__dirname, '../public/src/database/img/' + specials[i].id));
      for (let j = 0; j < files.length; j++) {
        if (files[j].startsWith("1")) {
          okindex = j;
        }
      }
      files = files.slice(okindex, okindex + 1);
      specials[i].indexkep = files[0];
    }

    res.render('index', { specials: specials, loggedIn: loggedIn, permission : permission, username: username, allPage: allPage, searchPage: searchPage, loginPage: loginPage }); // template
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

router.get('/cars', async (req, res, next) => {
  try {
    req.session.previousURL = "/cars";
    allPage = "active";
    searchPage = "";
    loginPage = "";
    if (req.session.user_id) {
      loggedIn = true;
      username = req.session.name;
      permission = req.session.jog;
    } else {
      loggedIn = false;
    }
    const resultElements = await Db.CountElements();
    res.render('allList', { list: resultElements, loggedIn: loggedIn, permission : permission, username: username, allPage: allPage, searchPage: searchPage, loginPage: loginPage }); // template
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

router.get('/cars/:page', async (req, res, next) => {
  try {
    let files;
    let okindex;
    pageNo = req.params.page - 1;
    if (pageNo < 0 || isNaN(pageNo)) {
      pageNo = 0;
    }
    const resultElements = await Db.Select30(pageNo);
    for (let i = 0; i < resultElements.length; i++) {
      files = fs.readdirSync(path.join(__dirname, '../public/src/database/img/' + resultElements[i].id));
      for (let j = 0; j < files.length; j++) {
        if (files[j].startsWith("index")) {
          okindex = j;
        }
      }
      files = files.slice(okindex, okindex + 1);
      resultElements[i].indexkep = files[0];
      resultElements[i].ar = stringToMoney(resultElements[i].ar);
    }
    res.render('30scroll', { list: resultElements }); // template
  } catch (e) {
    console.log(e); // console.log - Hiba esetén.
    res.sendStatus(500);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    req.session.previousURL = "/search";
    allPage = "";
    searchPage = "active";
    loginPage = "";
    if (req.session.user_id) {
      loggedIn = true;
      username = req.session.name;
      permission = req.session.jog;
    } else {
      loggedIn = false;
    }
    const makes = await Db.SelectAllMake();
    let modelsWithMake = JSON.stringify(await Db.SelectModelByMake());
    const minYear = await Db.SelectMinYear();
    const maxYear = await Db.SelectMaxYear();
    const maxPrice = await Db.SelectMaxPrice();
    const types = await Db.SelectAllType();
    const colors = await Db.SelectAllColor();
    const fuels = await Db.SelectAllFuel();
    const conditions = await Db.SelectAllCondition();
    const transmissions = await Db.SelectAllTransmission();
    const drives = await Db.SelectAllDrive();
    res.render('search', { makes: makes, modelsWithMake: modelsWithMake, minYear: minYear[0], maxYear: maxYear[0], maxPrice: maxPrice[0], types: types, colors: colors, fuels: fuels, conditions: conditions, transmissions: transmissions, drives: drives, loggedIn: loggedIn, permission : permission, username: username, allPage: allPage, searchPage: searchPage, loginPage: loginPage });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/search', async (req, res, next) => {
  try {
    let files;
    let okindex;

    let make = req.body.make;
    let models = req.body.models;
    let years = req.body.years;
    let prices = req.body.prices;
    let conditions = req.body.conditions;
    let colors = req.body.colors;
    let fuels = req.body.fuels;
    let types = req.body.types;
    let transmissions = req.body.transmissions;
    let drives = req.body.drives;
    const cars = await Db.Filter(make, models, years, prices, conditions, colors, fuels, types, transmissions, drives);
    for (let i = 0; i < cars.length; i++) {
      files = fs.readdirSync(path.join(__dirname, '../public/src/database/img/' + cars[i].id));
      for (let j = 0; j < files.length; j++) {
        if (files[j].startsWith("index")) {
          okindex = j;
        }
      }
      files = files.slice(okindex, okindex + 1);
      cars[i].indexkep = files[0];
      cars[i].ar = stringToMoney(cars[i].ar);
    }
    res.render('30scroll', { list: cars });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/car/:id', async (req, res, next) => {
  try {
    req.session.previousURL = "/car/" + req.params.id;
    let files;
    let images = [];
    let carId = req.params.id;
    let favourite = false;
    allPage = "";
    searchPage = "";
    loginPage = "";
    if (req.session.user_id) {
      loggedIn = true;
      username = req.session.name;
      permission = req.session.jog;
      const checkFavourite = await Db.CheckFavorite(req.session.user_id, carId);
      if(checkFavourite.length > 0){
        favourite = true;
      }
    } else {
      loggedIn = false;
    }
    const car = await Db.SelectOne(carId);
    if (car.length > 0) {
      files = fs.readdirSync(path.join(__dirname, '../public/src/database/img/' + car[0].id));
      for (let j = 0; j < files.length; j++) {
        if (!files[j].startsWith("index")) {
          images.push(files[j]);
        }
      }
    }
    car[0].ar = stringToMoney(car[0].ar);
    res.render('car', { list: car, images: images, loggedIn: loggedIn, permission : permission, username: username, allPage: allPage, searchPage: searchPage, loginPage: loginPage, favourite : favourite });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
