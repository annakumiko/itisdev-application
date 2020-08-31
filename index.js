/* DEPENDENCIES */
const express = require('express');
const hbs = require('handlebars');
const exphbs = require('express-handlebars');
const path = require('path');

/* EXPRESS APPLICATION */
const app = express();
const port = 9000;
  
/* PORT */
app.listen(port, function(){
    console.log("Listening to http://localhost:" + port);
});


/* CREATE HBS ENGINE */
app.engine('hbs', exphbs({  
  extname: 'hbs',
  defaultView: 'main',
layoutsDir: path.join(__dirname, '/views/layouts'),
partialsDir: path.join(__dirname, '/views/partials')
}));

app.get('/', function(req, res){
  res.render('home',{
    layout: 'main'
  });
});

// app.use(express.static(__dirname));
app.use(express.static('public'));

/* MONGODB LATER */