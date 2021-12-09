const routes = require("express").Router();
const dbService = require("../database/qadb");



//metod för att lägga till en contributor som super admin
routes.post('/question/:username/', async (req, res) => {

  
    try {
  
    if(!req.body.qTitle || !req.body.qText || !req.body.qCategory ){
  
    res.send(false);    
      return false;
  
    }else{
        console.log(req.body)
        let question = await dbService.addQuestion(req.body, req.params.username);
        res.json(question);
        return question;
    }
  
    } catch (error) {
        res.send("Nu gick det inte att lägga till en fråga");
    }
  });

//Funktion för att hämta frågor för alla frågor
routes.get('/questions/', async (req, res) => {
    try {
        const result = await dbService.getQuestions();
        
        res.json(result);
        return result;
    }
    catch (error) {
        console.log("Kunde inte hämta frågor");
    }
});

//uppdatera frågan som en consumer
routes.patch('/question/:qID', async (req, res) => {//updaterar fråga via id
    
    var id = req.params.qID;
    var data = {
        qTitle:req.body.qTitle,
        qText:req.body.qText,
        qCategory:req.body.qCategory,
        username:req.body.username,
    }

    try {
        const question = await dbService.updateQuestion(data,id);
        if(!question){
            res.send('Question updated')
        }else{
            res.send(question);
        }
    }
    catch (error) {
        res.send('Question couldent be updated, an error occured.');
    }
});

//uppdatera frågan som en consumer
routes.patch('/question/duplicate/:qID', async (req, res) => {//updaterar fråga via id
    
    var id = req.params.qID;

    try {
        const duplicate = await dbService.lableDuplicate(id);
        if(!duplicate){
            res.send('Marked as duplicate')
        }else{
            res.send(duplicate);
        }
    }
    catch (error) {
        res.send('Question couldent be updated, an error occured.');
    }
});


//Function to retreve all questions from a specifik category.
routes.get('/questions/filter/:category', async (req, res) => {
    try {
        const category = await dbService.getQuestionsByCategory(req.params.category);
        
        console.log(category);
        res.json(category);
        return category;
    }
    catch (error) {
        res.status(500).json(error);
        console.log("/questions/filter/:category' not working!")
    }
});

//Function to retreve all questions from a specifik category. En längst ner med, kolla upp.
routes.get('/questions/faqs/:category', async (req, res) => {
    try {
        const category = await dbService.getQuestionsByCategory(req.params.category);
        
        res.json(category);
        return category;
    }
    catch (error) {
        res.status(500).json(error);
        console.log("/questions/filter/:category' not working!")
    }
});


//REturns categories without duplicates.
routes.get('/questions/allCategories', async (req, res) => {
    try {
        const category = await dbService.getCategories();
        
        
        //console.log(
        res.json(category);
        return category;
    }
    catch (error) {
        res.status(500).json(error);
        console.log("/questions/filter/:category' not working!")
    }
});



routes.delete('/question/delete/:qID', async (req, res) => {
    const qID = req.params.qID;
  
    try {
        const deleteQuestion = await dbService.deleteQuestion(qID);
        if (deleteQuestion.changes !== 0) {
            res.json({ message: "delete successfully" });
        }
        else {
            res.json({ message: `Question with id: ${qID} is not found` });
            console.log('DELETE in /question/delete/:qID not working');
        }
  
    } catch (error) {
        res.json(error);
    }
  });
  


////////////////Answer start////////////////////

// To add a answer to a spesific question by retreving the question ID and also the username of the user who's answering
routes.post('/question/answer/:username', async(req,res) =>{

    let id = req.body.id;
    let body = {
        username:req.params.username,
        text:req.body.text
    }
    
    if(!body.text){
        res.send(false);
    }else{
            try {
                const answerQuestion = await dbService.addAnswer(id,body);
                console.log(answerQuestion);
                res.json(answerQuestion);
            } catch (error) {
                console.log('qa.js -> questions/answer/:id')
            }
        }
    });

// To get a answers to a spesific question by retreving the question ID 
routes.get('/question/answer/:id', async(req,res) =>{

    try {
    questionID = req.params.id;
    const answer = await dbService.getAnswerToquestion(questionID);


    res.json(answer);
    return answer;

} catch (error) {
    console.log('qa.js -> questions/answer/:id')
}

});


routes.get('/question/:id', async(req,res) =>{ 

    try {
        const answerQuestion = await dbService.getQuestion(req.params.id);
        
        res.json(answerQuestion);
    } catch (error) {
        console.log('qa.js -> questions/:id')
    }

});


routes.get('/questions/user/:username', async(req,res) =>{ 

    var username = req.params.username;
    try {
        const userQuestions = await dbService.getQuestionsByUsername(username);
        
        res.json(userQuestions);
        return userQuestions;
    } catch (error) {
        console.log('qa.js -> questions/:id')
    }

});


//UP and DOWN votes need the id of the answer and also an integer of value 1 returened for each time button is pressed. 

// giving the answer a upvote //works
routes.put('/question/answer/upvote/:answerID', async(req,res) =>{

    answerID = req.params.answerID; 

    try {
       
        const upvote = await dbService.addUpvote(answerID);

        res.send(upvote);
    } catch (error) {
        console.log('qa.js -> questions/answer/:upvote')
    }

});

// give an answer an downvote //works
routes.put('/question/answer/downvote/:answerID', async(req,res) =>{

    answerID = req.params.answerID; 


    try {

        const downVotes = await dbService.addDownvote(answerID);
  
        res.send(downVotes);
    } catch (error) {
        console.log(error + 'qa.js -> questions/answer/:downvote')
    }

});



// give an answer an downvote 
routes.get('/answers/', async(req,res) =>{


    try {
        const allAnswers = await dbService.getallAnswers();
        
        res.send(allAnswers);
    } catch (error) {
        console.log('qa.js -> /answers')
    }

});

// give an answer an downvote 
routes.get('/answer/:id', async(req,res) =>{


    try {
        const answer = await dbService.getAnswer(req.params.id);
        
        res.send(answer);
    } catch (error) {
        console.log('qa.js -> /answers')
    }

});


//uppdatera frågan som en consumer
routes.patch('/updateAnswer/:answerID', async (req, res) => {//updaterar fråga via id
    
    
    var answerID = req.params.answerID;
    var answerText= req.body.answerText;
        
    

    try {
        const updateAnswer = await dbService.updateAnswer(answerID,answerText);
        console.log(updateAnswer);
        if(!updateAnswer){
           res.send(true);
            console.log("Answ updated")
        }else{
            res.send(false);
        }
    }
    catch (error) {
        res.send('Answer couldent be updated, an error occured.');
    }
});

routes.delete('/answer/delete/:answerID', async (req, res) => {
    const answerID = req.params.answerID;
  
    try {
        const deleteAnswer = await dbService.deleteAnswer(answerID);
        if (deleteAnswer.changes !== 0) {
            res.json({ message: "deleted successfully" });
        }
        else {
            res.json({ message: `Answer with id: ${deleteAnswer} is not found` });
            console.log('DELETE in /answer/delete/:answerID not working');
        }
  
    } catch (error) {
        res.json(error);
    }
  });

//Funktion för att hämta frågor för alla frågor
routes.get('/questions/faq', async (req, res) => {
    try {
        const result = await dbService.getFAQ();
        
        res.json(result);
        return result;
    }
    catch (error) {
        console.log("Kunde inte hämta frågor");
    }
});

module.exports = routes;
