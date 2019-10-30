const express = require('express');
const mongodb = require('mongodb');
let sanitizeHTML = require('sanitize-html')

let app = express();
let db; //inilisasi db

//init dinamic port pada Heroku
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000
}

app.use(express.static('public'));//content pada folder public menjadi available untuk diakses root server
app.use(express.json())
app.use(express.urlencoded({ extended: false })); //boilerplate to make it to easier to acess body object
app.use(passwordProtected) //express always using password, before executing command

// string autentikasi mongodb yang berisi user, pass, namadb
let connectionMongo = 'mongodb+srv://root:GmtXRlZrcnOJdeo5@cluster0-wrori.mongodb.net/todoApp?retryWrites=true&w=majority'

// connecting mongodb
mongodb.connect(connectionMongo, { useNewUrlParse: true }, (error, client) => {
  db = client.db();
  app.listen(port, err => {
    if (err) throw err;
    console.log('Connected to localhost:3000');
  });
});

function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
  // console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic dDMyOnplbmlzbGV2") {
    //melakukan fungsi selanjunya pada app.get
    next();
  } else {
    res.status(401).send("Authentication required")
  }
}

app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, items) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        <div class="jumbotron p-3 shadow-sm">

          <form id="create-form" action='/create-item' method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="inputan" placeholder="Masukkan todo disini.." autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form> 

        </div>
        
        <ul id="item-list" class="list-group pb-5">

        </ul>
      </div>
      
    <script> let items = ${JSON.stringify(items)} </script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>  
    <script src="/browser.js"></script>
    </body>
    </html>`);
  });
});

app.post('/create-item', (req, res) => {
  //sanitizing dari inputan, dengan melarang tags dan attribute HTML
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
  db.collection('items').insertOne({ text: safeText }, (err, info) => {
    res.json(info.ops[0])
  });
});

app.post('/update-item', (req, res) => {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
  db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectID(req.body.id) }, { $set: { text: safeText } }, () => {
    res.send("Success updating")
  })
});

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectID(req.body.id) }, () => {
    res.send("Success deleted");
  })
})