
const express = require("express")
const bodyParser = require("body-parser")
const fruitModel = require("./models/fruit.js").fruit
const userModel = require("./models/user.js").user
const mongoose = require('mongoose'); 
const jwt = require("jsonwebtoken")
const app = express()
const jwtMiddleware = require("express-jwt").expressjwt
console.log(process.env.SECRET)
app.use(
  jwtMiddleware ({ 
    secret: process.env.SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/users/login",{url:"/users", method: "POST"}] })


)


app.use(bodyParser.urlencoded({ extended: false }))
const port = 3000
app.get ("/fruits", ( req, res) => {
  userModel.findById(req.auth._id).then(user=> {
    fruitModel.find({_id:{$nin:user.likedFruits.concat(user.dislikedFruits)}}).then((result)=>{
      res.send(JSON.stringify(result))
    
    
    
    })
  })




})
app.put("/users/likesFruits/:FruitId", (req,res)=>{
  console.log(req.auth._id)
  userModel.findById(req.auth._id).then(user=> {
    user.likedFruits.push(req.params.FruitId)
    user.save()
    res.send(user)
})})
app.put("/users/dislikesFruits/:FruitId", (req,res)=>{
  userModel.findById(req.auth._id).then(user=> {
    user.dislikedFruits.push(req.params.FruitId)
    user.save()
    res.send(user)
})})



mongoose.connect(`mongodb+srv://malachiramsey1234:${process.env.MONGODB_PASSWORD}@cluster0.kvlc7ha.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
)
app.get ("/users", (req, res)=>{
  userModel.find({}).then((result)=>{
    res.send(JSON.stringify(result))
  
  
  })
  
})
app.get ("/fruits/:Id", ( req, res) => {
  fruitModel.findById(req.params.Id).then((result)=>{
    res.send(JSON.stringify(result))
  
  
  })
  
  })
app.post ("/fruits", (req,res) => {
  const instance = new fruitModel()
  instance.name = req.body.name
  instance.image = req.body.image
  instance.save().then(()=> res.send(req.body))
})
app.post ("/users/login",(req,res) =>{
const user = req.body
const username = user.username
const password = user.password
console.log(username)
userModel.find({userName:username}).then((mal)=>{
  
  if (! mal) {res.status(404).send()
  return}
  const result = mal[0].toObject()

  if (result.password){
    if (password !== result.password) res.status(401).send()
  }
  const token = jwt.sign(
    { _id: result._id, },
    process.env.SECRET, 
    {
      expiresIn: "1d",
    }

  );
  
  console.log(token)
  result.token = token 
  res.send(result)
})

})
app.post("/users", (req,res) =>{
  const instance = new userModel()
  instance.userName = req.body.username
  instance.password = req.body.password
  instance.save().then(()=> res.send(req.body))
})
