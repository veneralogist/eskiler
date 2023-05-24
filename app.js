//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const session = require("express-session");

const mongoose = require("mongoose");

const homeStartingContent =
  "Bizler Ziya Uslu'nun ailesi ve sevenleri olarak, Saygıdeğer Merhum Büyüğümüz Ziya Uslu'nun anısını yaşatmak ve özlem gidermek için burada anılarından oluşan bir demeç hazırlamak istedik. Güzel anılar hoş sohbetlerde canlansın sitemizde de tarihe kazınsın diye bu girişimde bulunduk. Bizler yeni nesil olarak sadece Ziya Uslu'nun değil onun ışığında kıymetli tüm aile büyüklerimizi anmak, gelecek nesil üyelerimize anlatmak bizlere de anımsatmak için bir anılar defteri oluşturduk. Burada toplandığımız sıcak aile gecelerinde çay eşliğinde yapılan derin muhabbetlerde anılan hoş günleri yâd edeceğiz.Sevgiler";
const aboutContent =
  "Biz Ziya Uslu'nun Ailesiyiz ve onu ve onunla göçüp giden tatlı hatıraları yeniden yaşatmak , ve her daim canlı tutmak için el ele verdik bu amaçla bir anılar seçkisi oluşturduk, bu sayfada geçen her bir isim kaderin titrek ağlarında bize ve gönlümüze değmeyi başarmış kutlu insanlardır.Sen her kimsen, torun, kuzen, amca, dayı, yada bambaşka biri bil ki bu site Unutmayanların sitesidir.";

const app = express();

var posts = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(
  "mongodb+srv://bilimsel314:xdxdhgfdsA314@eskiler.dw0gizx.mongodb.net/Eskiler?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const memoriesSchema = {
  title: String,
  yazar: String,
  content: String,
};
const Moment = mongoose.model("Moment", memoriesSchema);

async function getAllMoments() {
  try {
    const moments = await Moment.find();
    return moments;
  } catch (err) {
    console.log(err);
  }
}

app.get("/home", async function (req, res) {
  const allMoments = await getAllMoments();

  res.render("home", {
    hsc: homeStartingContent,
    psts: allMoments,
    tip: req.session.loggedIn,
  });
});
app.get("/cik", (req, res) => {
  req.session.loggedIn = false;
  res.redirect("/home");
});
app.get("/posts/:title", async function (req, res) {
  PostTitle = req.params.title;
  const ani = await Moment.findOne({ title: PostTitle });

  if (ani) {
    const aniObject = ani.toObject();
    console.log(aniObject);
    res.render("post", { pst: aniObject, tip: req.session.loggedIn });
    // ...
  } else {
    console.log(`Moment with title ${PostTitle} not found.`);
    // ...
  }
});

app.post("/dogrula", function (req, res) {
  console.log(process.env.SIFRE);
  console.log(req.body.sifre);
  if (req.body.sifre === process.env.SIFRE) {
    req.session.loggedIn = true;
    res.redirect("/home");
  } else {
    res.redirect("/");
  }
});

app.get("/", (req, res) => {
  res.render("giris");
});

app.get("/about", function (req, res) {
  res.render("about", { ac: aboutContent, tip: req.session.loggedIn });
});
app.post("/sifre", function (req, res) {
  res.redirect("/sifre");
});

app.get("/sifre", function (req, res) {
  res.render("giris", { tip: req.session.loggedIn });
});

app.get("/compose", function (req, res) {
  res.render("compose", { tip: req.session.loggedIn });
});

app.post("/compose", function (req, res) {
  if (req.body.postTitle.length > 0 && req.body.postBody.length > 0) {
    const ani = new Moment({
      title: req.body.postTitle,
      yazar: req.body.Writer,
      content: req.body.postBody,
    });
    ani.save();
    res.redirect("/home");
  } else {
    res.redirect("/compose");
  }
});
app.post("/onayla", (req, res) => {
  const title = req.body.title.replace(/_/g, " ");
  const content = req.body.content.replace(/_/g, " ");
  const yazar = req.body.yazar.replace(/_/g, " ");

  if (title.length > 0 && content.length > 0) {
    Moment.findOneAndUpdate(
      { _id: req.body.id },
      {
        title: title,
        yazar: yazar,
        content: content,
      }
    )
      .then((updatedMoment) => {
        if (updatedMoment) {
          res.redirect("/home");
        } else {
          // Hata işleme - Güncellenen anı bulunamadı
          res.redirect("/home");
        }
      })
      .catch((error) => {
        // Hata işleme - Veritabanı hatası
        res.redirect("/home");
      });
  } else {
    // Hata işleme - Boş alanlar
    res.redirect("/home");
  }
});
app.get("/agac", function (req, res) {
  res.render("agac", { tip: req.session.loggedIn });
});
app.get("/duzenle/:title", async function (req, res) {
  PostTitle = req.params.title;
  const ani = await Moment.findOne({ title: PostTitle });

  if (ani) {
    const aniObject = ani.toObject();
    console.log(aniObject.title);
    res.render("duzenle", { post: aniObject, tip: req.session.loggedIn });
    // ...
  } else {
    console.log(`Moment with title ${PostTitle} not found.`);
    // ...
  }
});














app.listen(process.env.PORT || 3000, () => {
  console.log("Server started ");
});
