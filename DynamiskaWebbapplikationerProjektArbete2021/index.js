const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require('express-session');
  app.use(
      session({
      secret: 'thisisasecret',
      saveUninitialized: false,
      resave: false })
      );



const userRoute = require('./routes/users');
const questionRoute = require('./routes/qa');

app.use(cors())

const PORT = process.env.PORT || 3055;
app.set('port', PORT);
app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`)
});


//statisk fil -->  levererar endast innehållet. Inget händer. 
app.use(express.static('public')); //foldern/mappen vi vill leveerera statiska filer ifrån. Komemr foldra under public mappen att hantera statiska filer..
app.use(express.json()); // middleware, säger att vi vill anv json.


//body-parser --> Used for HTML input... You need to parse the body to get the method param:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



app.use('/api/',userRoute);
app.use('/', questionRoute);