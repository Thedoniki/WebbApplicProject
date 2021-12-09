const routes = require("express").Router();
const dbService = require("../database/usersdb");

var sess;

 routes.get("/home/", (req, res) => {
   
  //req.url;

  res.redirect("/home.html");
 });


routes.get('/users/', async(req,res) => {

  
   try {
     

    const users = await dbService.getAllUsers();
  
    res.send(users);
    return users;

   } catch (error) {
     console.log('users<- /users')
   }


});



//add user
routes.post("/register/", async (req, res) => {
  let data = {
    role: req.body.role,
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const regUser = await dbService.addUser(data);
    console.log(regUser);
    res.json({
      info: "User registerd in database",
    });
  } catch (error) {
   
    res.json("User could not be registerd");
  }
});


//metod för att lägga till en contributor som super admin
routes.post('/addcontributor/', async (req, res) => {

  let data = {
    username: req.body.username,
    password: req.body.password,
  };

  try {

  if(!data){

    return false;

  }else{
    const addContributor = await dbService.addContributor(data);
    console.log(addContributor);
    res.send({ info: "insert successfully" });
  }

  } catch (error) {
      res.send(error.message);
  }
});






//login and also sends data if the user is banned
routes.post("/login/", async (req, res) => {
  try {
    
    const user = await dbService.doLogin(req.body);
  
    var theState = await dbService.userState(req.body);
  

    //console.log(theState);
     
    Object.keys(theState).forEach(async function(key) {
      
       if (theState[key] == 'Banned' ) {

        
        res.json(theState);

       }else{
        if (!user) {

          res.json(false);
          //console.log("User not found");
          //res.sendStatus(404).send('Not found');
        } else {
          sess = req.session;
          
          var loggedin = await dbService.getUserByUsername(req.body);
          
          sess.user = loggedin;
          res.json(loggedin);
    
          }
       }
     });

    
    
  } catch (error) {
    console.log("/login in users.js error");
    res.json(false);
  }
});




routes.get('/loggedinuser', async (req, res) => {
  try {
          
      sess = req.session;
      if (sess.user) {
          //We are loggged in and can return logged in user

          let obj = {
              "loggedin": true,
              "user": sess.user[0]
          }

          
          res.json(obj);
      } else {
          let obj = {
              "loggedin": false
          }
         // console.log(obj)
          
          res.json(false);
      }


  } catch (error) {
      console.log(error);
      res.json("Gick ej att hämta användare")
  }

});



routes.get("/user/:username", async (req, res) => {
  let username = req.params.username;
  try {
    const user = await dbService.getUserByUsername(username);
    res.redirect('/api/home/');
    return user;
  } catch (error) {
    console.log("Error in users.js row 21.");
  }
})

routes.get("/thisUser/:username", async (req, res) => {
  let username = req.params.username;
  try {
    const user = await dbService.getTheUserByUsername(username);
    if(!user){
      console.log("User not found");
      res.send({ message: `User with username: ${username} is not found` });
    }else{

    res.json(user);
    return user;
    }
  } catch (error) {
    console.log("Error in users.js row 155.");
  }
})




routes.get("/logout/", (req, res,next) => {
  
  req.logOut;
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    userData = null;
    res.redirect("/index.html");
  });
});


//metod för att hämta alla contributo
routes.get('/contributors/', async (req, res) => {
  contributor = req.body.role;
  try {
      const contributors = await dbService.getContributors(contributor);

      res.send(contributors);

  }
  catch (error) {
      res.send("users<- contributors")
  }
});



//metod för att uppdatera en user som super admin
routes.put('/user/:id', async (req, res) => {//updaterar user via id
  try {
      const user = await dbService.updateUser(req.params.id, req.body);
      res.send('Användaren ändrades')
  }
  catch (error) {
      res.send('Nu gick det inte att uppdatera användaren');
  }
});

// routes.get('/user/:id', async (req, res) => {
//   try {
//       const users = await dbService.getUser(req.params.id);
//       res.json(users);
//   }
//   catch (error) {
//       res.json({ status: 'Kunde inte hämta användare' });
//   }
// });



//for being able to bann a user
routes.patch('/bann/:username', async (req, res) => {//updaterar user via id
  try {
      const user = await dbService.bannUser(req.params.username);
      res.send('User is now banned');
  }
  catch (error) {
    console.log(error);
      res.send('Something went wrong, the bann could not be completed');
  }
});

//for being able to bann a user
routes.patch('/unBann/:username', async (req, res) => {//updaterar user via id
  try {
      const user = await dbService.unBannUser(req.params.username);
      res.send('User is now banned');
  }
  catch (error) {
    console.log(error);
      res.send('Something went wrong, couldnt unbann user');
  }
});


routes.delete('/user/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
      const deleteProduct = await dbService.deleteUser(id);
      if (deleteProduct.changes !== 0) {
          res.json({ info: "delete successfully" });
      }
      else {
          res.json({ info: `User with id: ${id} is not found` });
      }

  } catch (error) {
      res.json(error);
  }
});


module.exports = routes;
