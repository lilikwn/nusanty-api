const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const Article = require('../models/Article');
const { verifyTokenAPI } = require('../configs/verifyTokenAPI');
const { upload } = require('../controller/fileController');

router.get('/article', verifyTokenAPI, async (req, res, next) => {
  const articles = await Article.find({}, {_id: 0, __v:0})
  if(!articles){
    return res.status(400).json({
      error: true,
      status: res.statusCode,
      message: "No Article"
    })
  }
  return res.status(200).json({
    error: false,
    status: res.statusCode,
    message: "Stories fetched successfully",
    articles
  })
})

router.post('/article', verifyTokenAPI, async (req, res, next) => {
  const id = req.body.id.toLowerCase()
  const articleIdExist = await Article.findOne({ id });
  if (articleIdExist) {
    return res.status(400).json({
      error: true,
      status: res.statusCode,
      message: 'Article ID already exist',
    });
  }
  const article = await new Article({
    id,
    title: req.body.title,
    location: req.body.location,
    description: req.body.description,
    photoUrl: req.body.photoUrl,
  });
  try {
    const saveArticle = await article.save();
    res.json({
      error: false,
      message: 'Article Added',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      status: res.statusCode,
      message: 'Failed to add Article',
    });
  }
});

router.get('/article/:id', verifyTokenAPI, async (req, res, next) => {
  const id = req.params.id.toLowerCase();
  const article = await Article.findOne({ id : id });
  if (!id) {
    return res.status(400).json({
      error: true,
      statusCode: res.statusCode,
      message: 'Please enter the ID behind the Endpoint (/article/{id})',
    });
  }
  if (!article) {
    return res.status(400).json({
      error: true,
      statusCode: res.statusCode,
      message: 'Article id not Found',
    });
  }
  try {
    res.json({
      error: false,
      statusCode: res.statusCode,
      message: 'Article fetched successfully',
      articleData: {
        id,
        title: article.title,
        location: article.location,
        description: article.description,
        photoUrl: article.photoUrl,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      statusCode: res.statusCode,
      message: 'failed to fetched Article',
    });
  }
});

module.exports = router;
