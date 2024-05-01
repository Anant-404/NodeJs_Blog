require('dotenv').config();//to use .env dependency 


const express=require('express');
const expressLayout=require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser=require('cookie-parser');
const session = require('express-session');
const MongoStore=require('connect-mongo');

const connectDB=require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');


const app=express();
const PORT=8080 || process.env.PORT;//to use their defined port where we will host


//connect to database
connectDB();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));
  

  app.use(express.static('public'));

  // Templating Engine
  app.use(expressLayout);
  app.set('layout', './layouts/main');
  app.set('view engine', 'ejs');


//note not all routes will be in app.js else it will get messy 
//rest of the routes will be in server folder

app.locals.isActiveRoute = isActiveRoute; 

app.use('/',require('./server/routes/main'));//to access folder
app.use('/',require('./server/routes/admin'));


app.listen(PORT,() =>{
    console.log(`app listening on port ${PORT}.`);
});
