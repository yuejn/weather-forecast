const models = require('../models');
const fs = require('fs');

exports.root = (req, res) => {
  res.sendStatus(200);
};

exports.getToday = (req, res, next) => {
  if(!req.query.location) {
    res.status(400)
       .json({
        message: "Need `location` parameter."
      });
  } else {
    const location = req.query.location;
    res.status(200);
    res.send();
  }
};
