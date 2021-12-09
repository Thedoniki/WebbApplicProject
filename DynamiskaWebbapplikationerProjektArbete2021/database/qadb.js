
// require sqlite to be able to use CRUD-OPERATIONS on our database
const dbPromise = require('./dbSetup');

//////////////QUESTION START /////////////////////


const addQuestion = async (question,username) => {
    
    try {
      if(question){
        const qDuplicate = "No";
        // const qDuplicate = "Duplicate";
         const dbCon = await dbPromise;
         await dbCon.run(`INSERT INTO question (qTitle, qText,qCategory, username, qDuplicate) VALUES(?,?,?,?,?)`, [question.qTitle,question.qText,question.qCategory,username,qDuplicate]);
         return { status: "ok!"};
      }else{
          return false;
      }
    }
    catch(error) {
        throw new Error(error);
    }
}

const updateQuestion = async (data,qID) => {
    try {
        const dbCon = await dbPromise;
        await dbCon.run(`UPDATE question SET qTitle=?, qText=?, qCategory=? WHERE qID=?`, [data.qTitle, data.qText,data.qCategory,qID]);
        
    }
    catch (error) {
        console.log('updateQuestion in db')
        throw new Error(error)
    }
};



//REturns categories without duplicates.
const getCategories = async() => {
   
    try {
        const dbCon = await dbPromise;

        const cate = await dbCon.all(`SELECT qCategory FROM question`);

      JSON.stringify(cate);

        var seenNames = {};

      var array =  cate.filter(function(currentCategory) {
            if (currentCategory.qCategory in seenNames) {
                return false;
            } else {
                seenNames[currentCategory.qCategory] = true;
                return true;
            }
        });

        return array;

    
    } catch (error) {
        
        console.log(error);
    }

}



const lableDuplicate = async (qID) => {
    try {
        const qDuplicate = "Duplicate";
        const dbCon = await dbPromise;
        await dbCon.run(`UPDATE question SET qDuplicate=? WHERE qID=?`, [qDuplicate,qID]);

    }
    catch (error) {
        console.log('updateQuestion in db')
        throw new Error(error)
    }
};


const getQuestionsByUsername = async (username) => {
    //returnera produkter
    try {
        const dbCon = await dbPromise;
        const questions = await dbCon.all('SELECT * FROM question WHERE username=? ORDER by date ASC', [username])

        return questions;
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
};


const getQuestionsByCategory = async (qCategory) => {
    //returnera produkter
    try {
        const dbCon = await dbPromise;
        const questions = await dbCon.all('SELECT * FROM question WHERE qCategory=?', [qCategory])

        return questions;
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
};


const getQuestionsByFAQCategory = async (qCategory) => {
    
   var qDuplicate = "Duplicate";
   
    //returnera frågor
    try {
        const dbCon = await dbPromise;

        const faq = await dbCon.all('SELECT * FROM question WHERE qDuplicate = ?',[qDuplicate]);
        const questions = await dbCon.all('SELECT * FROM question WHERE qCategory=?', [qCategory]);

        let faqArr = [faq];
        let questionsArr = [questions];

        
        let map = {};
        faqArr.forEach(i => map[i] = false);
        questionsArr.forEach(i => map[i] === false && (map[i] = true));
        let jsonArray = Object.keys(map).map(k => ({ name: k, matched: map[k] }));

        return jsonArray;
    }
    catch(error){
        console.log(error);
    }
};

const getQuestions = async () => {
    //returnera frågor
    try {
        const dbCon = await dbPromise;
        const questions = await dbCon.all('SELECT * FROM question')

        return questions;
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
};

const getQuestion = async (id) => {
    //returnera frågor
    try {
        const dbCon = await dbPromise;
        const question = await dbCon.get('SELECT * FROM question WHERE qID=?',[id])

        return question;
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
};



const deleteQuestion = async (qID) => {
    try {
        const sqlQuery = 'DELETE FROM question where qID = ?';
        const db = await dbPromise;
        return db.run(sqlQuery, qID);
    } catch (error) {
        throw new Error(error);
    }
};
//////////////QUESTION END /////////////////////

//////////////ANSWERS START /////////////////////


const addAnswer = async (questionID,answer) => {
    
    console.log(questionID)
    try {
        const dbCon = await dbPromise;
        let answers = await dbCon.run(`INSERT INTO answer (questionID,username,answerText,upvote,downvote) VALUES(?,?,?,?,?)`, [questionID,answer.username,answer.text,0,0]);
        console.log(answers);
        return { status: "ok!"};
    }
    catch(error) {
        throw new Error(error);
    }
};



const getAnswervotes = async (answerID) => {
    try{
        const dbCon = await dbPromise;
        const answers = await dbCon.all('SELECT downvote FROM answer WHERE answerID = ?',[answerID]);
  
       return answers;
        
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
}

const addUpvote = async (answerID) => {//fukar ikke
    try {

        const dbCon = await dbPromise;
        const upvoted =  await dbCon.run(`UPDATE answer SET upvote=upvote+1 WHERE answerID=?`, [answerID]);
        
        return upvoted;
    } catch (error) {
        throw new Error('Error, couldnt upvote answer');
    }
}



const addDownvote = async (answerID) => {// funkar ikke
    

    try {

    

        const dbCon = await dbPromise;
        const upDownvoted = await dbCon.run(`UPDATE answer SET downvote=downvote - 1 WHERE answerID=?`, [answerID]);
        return upDownvoted;
    } catch (error) {
        throw new Error('Error, couldnt downvote answer');
    }
}

///requesta
const getallAnswers = async () => {
    //returnera produkter
    try {
        const dbCon = await dbPromise;
        const answers = await dbCon.all('SELECT * FROM answer');
  
       return answers;
        
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
};


const getAnswerToquestion = async (questionID) => {
    try{
        const dbCon = await dbPromise;
        const answer = await dbCon.all('SELECT * FROM answer WHERE questionID = ?',[questionID]);

       return answer;
        
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
}



const updateAnswer = async (answerID,answerText) => {
    try {
        const dbCon = await dbPromise;
        await dbCon.run(`UPDATE answer SET answerText=? WHERE answerID=?`, [answerText,answerID,]);
      
    }
    catch (error) {
        console.log('Answer updated in db' + error)
      
   
    }
};


const deleteAnswer = async (answerID) => {
    try {
        const sqlQuery = 'DELETE FROM answer where answerID = ?';
        const db = await dbPromise;
        return db.run(sqlQuery, answerID);
    } catch (error) {
        throw new Error(error);
    }
};


const getAnswer = async (id) => {
    //returnera frågor
    try {
        const dbCon = await dbPromise;
        const answer = await dbCon.get('SELECT * FROM answer WHERE answerID=?',[id])

        return answer;
    }
    catch (error) {
        throw new Error('Error, something went wrong');
    }
};

//////////////ANSWERS END /////////////////////

const getFAQ = async () => {


    try {
        const qDuplicate= "Duplicate"
        const dbCon = await dbPromise;
        const faq = await dbCon.all('SELECT * FROM question WHERE qDuplicate = ?',[qDuplicate]);
  
       return faq;
    }   
       catch (error) {
        throw new Error('Error, something went wrong');
    }


}




module.exports = {

    addQuestion:addQuestion,
    updateQuestion:updateQuestion,
    deleteQuestion:deleteQuestion,
    getQuestionsByUsername:getQuestionsByUsername,
    getQuestionsByCategory:getQuestionsByCategory,
    addAnswer:addAnswer,
    getQuestions:getQuestions,
    addUpvote:addUpvote,
    addDownvote:addDownvote,
    getallAnswers:getallAnswers,
    getQuestion:getQuestion,
    getAnswerToquestion:getAnswerToquestion,
    getAnswervotes:getAnswervotes,
    getFAQ:getFAQ,
    lableDuplicate:lableDuplicate,
    getQuestionsByFAQCategory:getQuestionsByFAQCategory,
    getCategories:getCategories,
    getAnswer:getAnswer,
    updateAnswer:updateAnswer,
    deleteAnswer:deleteAnswer   


};