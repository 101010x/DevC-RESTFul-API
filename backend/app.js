//An Express app is basically a series of functions called middleware. Each piece of middleware receives the request and response objects, and can read, parse, and manipulate them as necessary.
//MongoDB pass: pgXhEdxE4FXNnteY
//MongoDB Connection: mongodb+srv://mutugi:<password>@cluster0-gsja1.mongodb.net/test?retryWrites=true&w=majority


//Declaration of express app
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();


mongoose.connect('mongodb+srv://mutugi:pgXhEdxE4FXNnteY@cluster0-gsja1.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log('Succesfully connected to MongoDB Atlas');
    })
    .catch((error) => {
      console.log('Unable to connect to MongoDB Atlas');
      console.error(error);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

//post route
app.post('/api/recipes', (req,res,next) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    time: req.body.time,
    difficulty: req.body.difficulty
  });
  recipe.save().then(
    ()=> {
      res.status(201).json({
        message: 'Post successfully saved!'
      });
    }).catch((error) => {
      res.status(400).json({
        error: error
      });
    });
});

//route to find a single element
//we use :id to show that it is dynamic
app.get('/api/recipes/:id',(req,res,next) => {
  Recipe.findOne({
    _id: req.params.id
  }).then(
    (recipe) => {
      res.status(200).json(recipe);
  }).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
  });
});

//route to update/modify an item
//We specify Id so as to ensure that it remains the same
app.put('/api/recipes/:id', (req, res, next) => {
  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    time: req.body.time,
    difficulty: req.body.difficulty
  });
  Recipe.updateOne({_id: req.params.id}, recipe).then(
    () => {
      res.status(201).json({
        message: 'Recipe updated successfully!'
      });
    }).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    });
});

//delete route
app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    });
});

//get route
app.get('/api/recipes',(req,res,next) => {
  Recipe.find().then(
    (recipes) => {
      res.status(200).json(recipes);
    }
  ).catch(
    () => {
      res.status(400).json({
       error: error
      });
    });
});

module.exports = app;