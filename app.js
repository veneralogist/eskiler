//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");

const mongoose = require("mongoose");


const homeStartingContent =
  "Bizler Ziya Uslu'nun ailesi ve sevenleri olarak, Saygıdeğer Merhum Büyüğümüz Ziya Uslu'nun anısını yaşatmak ve özlem gidermek için burada anılarından oluşan bir demeç hazırlamak istedik. Güzel anılar hoş sohbetlerde canlansın sitemizde de tarihe kazınsın diye bu girişimde bulunduk. Bizler yeni nesil olarak sadece Ziya Uslu'nun değil onun ışığında kıymetli tüm aile büyüklerimizi anmak, gelecek nesil üyelerimize anlatmak bizlere de anımsatmak için bir anılar defteri oluşturduk. Burada toplandığımız sıcak aile gecelerinde çay eşliğinde yapılan derin muhabbetlerde anılan hoş günleri yâd edeceğiz.Sevgiler";
const aboutContent =
  "Biz Ziya Uslu'nun Ailesiyiz ve onu ve onunla göçüp giden tatlı hatıraları yeniden yaşatmak , ve her daim canlı tutmak için el ele verdik bu amaçla bir anılar seçkisi oluşturduk, bu sayfada geçen her bir isim kaderin titrek ağlarında bize ve gönlümüze değmeyi başarmış kutlu insanlardır.Sen her kimsen, torun, kuzen, amca, dayı, yada bambaşka biri bil ki bu site Unutmayanların sitesidir.";

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
