//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");

const mongoose = require("mongoose");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const app = express();

var posts=[]

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb+srv://bilimsel314:xdxdhgfdsA314@eskiler.dw0gizx.mongodb.net/Eskiler?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
const memoriesSchema={
  title:String,
  content:String,
}
const Moment=mongoose.model("Moment",memoriesSchema);




async function getAllMoments() {
  try {
    const moments = await Moment.find();
    return moments;
  } catch (err) {
    console.log(err);
  }
}

app.get("/", async function(req,res){
  const allMoments = await getAllMoments();
  res.render("home" ,{hsc:homeStartingContent,psts:allMoments})
});

app.get("/posts/:title", async function(req, res){
  PostTitle=req.params.title;
  const ani = await Moment.findOne({title:PostTitle})
  
  if (ani) {
    const aniObject = ani.toObject();
    console.log(aniObject);
    res.render("post", {pst:aniObject});
    // ...
  } else {
    console.log(`Moment with title ${PostTitle} not found.`);
    // ...
  }
})

app.post("/dogrula", function(req, res){
  if (req.body.sifre == "xdxdhgfdsA314") {
    res.render("compose");
  } else {
    res.render("error");
  }
});


app.get("/about",function(req,res){

  res.render("about" ,{ac:aboutContent})

})
app.post("/sifre",function(req,res){
  res.redirect("/sifre")
})


app.get("/sifre",function(req,res){
    res.render("password")
})

app.get("/compose",function(req,res){
  res.render("password")
})
app.post("/compose",function(req,res){
  if(req.body.postTitle.length>0&&req.body.postBody.length>0){
  const ani=new Moment({
    "title":req.body.postTitle,
    "content":req.body.postBody
  })
  
  ani.save()
  res.redirect("/");
}else{
  res.redirect("/compose")


}
})
app.get("/agac", function (req, res) {
  res.render("agac");
});















app.listen(process.env.PORT || 3000, () => {
  console.log("Server started ");
});
