const express = require('express');
const router = express.Router();

const History = require("../models/historyModel");

router.get('/getHistory', (req, res, next) => {
  History.find().exec()
    .then(docs => {
      res.status(200).json(docs);
    });
});

router.get('/getHistory/:historyId', (req, res, next) => {
  const toBeSearched = req.params.keyword;
  const id = req.params.historyId;

  History.find({_id:req.params.historyId}).exec()
    .then(docs => {
      res.status(200).json(docs);
    });

});

module.exports = router;
