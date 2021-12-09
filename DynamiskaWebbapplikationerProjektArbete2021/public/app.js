const vm = new Vue({
    el: '#app',
    data: {
        userQuestion: [],
        users: [],
        currentLoggedInUser: [],
        messageToUser: "",
        questions: [],
        answers: [],
        userForUpdate: {},
        contributors: [],
        question:{},
        answer:{},
        FAQanswer:{},
        faqs:[],
        msg: false,
        FAQbyCat:[],
        FaqbyCat:[],
        categories:[]
    },

    methods:{
//, WORKS
        loginUser() {
            const user = {
                username: $("#loginUsername").val(),
                password: $("#loginPassword").val(),
            };
            $.ajax({

                url: '/api/login/',
                type: 'POST',
                data: user,
                success: (data) => {
                    
                    var self = this;
                    if (data.status == 'Banned') { //Reports if user is temp blocked
                        self.currentLoggedInUser = false;
                        messageToUser = 'You are banned'
                        alert('You are temporarly blocked.');
                    } else if (!data) { // Reports if username or password is wrong
                        self.currentLoggedInUser = false;
                        messageToUser = 'Wrong password or username'
                        alert('Wrong password or username');
                    } else if (data) { // if everything is correct go on wit logging in.

                        self.currentLoggedInUser = data[0];
                        window.location.href = '/api/home/';
                        //self.currentLoggedInUser = data[0];
                        $.getJSON("/api/loggedinuser/", function (data) {
                            JSON.parse(JSON.stringify(data));

                        })

                    } else {
                        self.currentLoggedInUser = false; // if something else besides the things above are wrong.
                        messageToUser = 'Something went wrong, try again later.'
                        alert('Something went wrong, try again later.');
                    }


                }
            });
        },

//, WORKS
        getLoggedInUser: function () {

            $.ajax({
                url: '/api/loggedinuser',
                type: 'GET',
                success: (data) => {
                    var self = this;
                    if (data["currentLoggedInUser"]) {
                        self.currentLoggedInUser = data["user"];
                        //  console.log(currentLoggedInUser);
    
                        $.getJSON('/api/user/' + data.username, function (data) {
                            self.currentLoggedInUser = data;
                            window.location.href = '/api/home/'
    
                            if (self.currentLoggedInUser.user.role == 'Super Admin' || self.currentLoggedInUser.user.role == 'Consumer') {
                                $.getJSON('/questions/user/' + self.currentLoggedInUser.user.username, function (data) {
        
                                    self.userQuestion = data;
                                });
                            };
                        });
    
                    } else if (data["Not Found"]) {
                        self.currentLoggedInUser = false;
                        console.log("You shall not pass")
                        alert("wrong")
                        window.location.href = "/";
                    }
                },
                error: (data) => {
                    console.log("Error", data)
    
                }
            });
    
        },

//, WORKS
        addContributor: function(){
            const cont = {
                username: $('#addUsername').val(),
                password: $('#addPassword').val()
            }
    
            $.ajax({
                url: '/api/addcontributor/',
                type: 'POST',
                data: cont,
                success: () => {
    
                    if(!cont.username ){
                        alert("Fill in username");
                    }else if(!cont.password){
                        alert("fill in password")
                    }else{

                        this.getUsers();

                    }
                    
    
                    $('#addModal').modal('hide');
                }
            });
        },

        //show details about a user in the update modal, WORKS
        showUserInUpdateForm(username) {
           
            $.ajax({
                url: '/api/thisUser/' + username,
                type: 'GET',
                success: (user) => {
                    this.userForUpdate = user;
                    if(!user){
                        console.log("error");
                    }else{
                 
                    $('#updateRole').val(user.role);
                    $('#updateUsername').val(user.username);
                    $('#updateStatus').val(user.status);
                    $('#updateId').val(user.id);
                    $('#theId').html(user.id);
                    
                    }
                  
                }
            });
               $('#updateModal').modal('show'); 
        },

        //, WORKS
        updateUser() {
            
            let user = {
                role: $('#updateModal #updateRole').val(),
                username: $('#updateModal #updateUsername').val(),
                status: $('#updateModal #updateStatus').val(),
                id: $('#updateModal #updateId').val()

            };
           
               
            $.ajax({
                url: '/api/user/' + user.id,
                type: 'PUT',
                data: user,
                success: () => {

                    this.getUsers();
                    
                 $('#updateModal').modal('hide');
                    
                },error: (error) => {
                    console.log(error);
                  }

            });

        },

        
        deleteUser() { //, WORKS

            var user = {
                id: $('#updateModal #updateId').val()
            }

            $.ajax({
                url: '/api/user/delete/' + user.id,
                type: 'DELETE',
                success: () => {

                    this.getUsers();
                    
                    $('#updateModal').modal('hide');
                }
            });


        },
             //, WORKS
             bannUser() {

                let user = {

                    username: $('#updateModal #updateUsername').val(),
    
                };
                  
                $.ajax({
                    url: '/api/bann/' + user.username,
                    type: 'PATCH',

                    success: () => {
    
                        this.getUsers();
                        
                     $('#updateModal').modal('hide');
                        
                    },error: (error) => {
                        console.log(error);
                      }
    
                });
    
            },

            unBanUser(){

                
                let user = {

                    username: $('#updateModal #updateUsername').val(),
    
                };
                  
                $.ajax({
                    url: '/api/unBann/' + user.username,
                    type: 'PATCH',

                    success: () => {
    
                        this.getUsers();
                        
                     $('#updateModal').modal('hide');
                        
                    },error: (error) => {
                        console.log(error);
                      }
    
                });

            },

///////////'Question start/////////////

getFAQfromCat(category){ /////WORKS
       
    $.ajax({
        url: '/questions/filter/'+ category,
        type: 'GET',
        success: (FAQbyCat) => {

            if(!FAQbyCat){
                $.getJSON("/questions/", function (jsondata) {
                    JSON.stringify(jsondata);
                    this.FAQbyCat = jsondata;
                });
            }else{
         
                this.FAQbyCat = FAQbyCat;
            }
        }
    });
       $('#multiCollapseExample1').collapse('show'); 
},
    lableDuplicate(){  ////WORKS
        let question = {

            qID: $('#updateQuestionModal #qID').val(),
            qDuplicate: $('#updateQuestionModal #qDuplicate').val()
        };
       
        $.ajax({
            url: '/question/duplicate/' + question.qID,
            type: 'PATCH',
            data: question,
            success: () => {
    
                var self = this;
                if(question.qDuplicate == "No"){
                     $.getJSON("/questions/", function (jsondata) {
                        self.questions = jsondata;
                        $('#updateQuestionModal').modal('hide');
                    });
                    
                }else{

                   self.msg = true;
                   
                } 
                
            }
        });
    },

    //Add Question, WORKS
     askQuestion() {

        
        var question = {
           qTitle: $('#questionModal #title').val(),
           qText: $('#questionModal #text').val(),
           qCategory: $('#questionModal #category').val(),
        }

        $.ajax({
            url: '/question/' + this.currentLoggedInUser.user.username,
            type: 'POST',
            data: question,
            success: (question) => {

                var self = this;

                if(!question){
                    alert("All fields have to be filled");
                }else{
                    this.getQuestions();
                    self.question = question;
            
                
                $('#questionModal').modal('hide');
                }

            }
        }); 
     },

      //show details about a user in the update modal, WORKS
      showQuestionInUpdateForm(id) {
           
        $.ajax({
            url: '/question/' + id,
            type: 'GET',
            success: (question) => {
                this.question = question;
                
                  
                $('#qID').val(question.qID);
                $('#qUsername').val(question.username);
                $('#qCategory').val(question.qCategory);
                $('#qTitle').val(question.qTitle);
                $('#qText').val(question.qText);

            }
        });
           $('#updateQuestionModal').modal('show'); 
    },
    updateQuestion(){

    let question = {
        qCategory: $('#updateQuestionModal #qCategory').val(),
        qTitle: $('#updateQuestionModal #qTitle').val(),
        qText: $('#updateQuestionModal #qText').val(),
        qID: $('#updateQuestionModal #qID').val()

    };
   
    $.ajax({
        url: '/question/' + question.qID,
        type: 'PATCH',
        data: question,
        success: () => {

            var self = this;
                $.getJSON("/questions/", function (jsondata) {
                    self.questions = jsondata;
                    self.FAQbyCat = jsondata;
             $('#updateQuestionModal').modal('hide');
                });
            
        
            
        }

    });

},
        
deleteQuestion() { //, WORKD

    var q = {
        qID: $('#updateQuestionModal #qID').val()
    }

    $.ajax({
        url: '/question/delete/' + q.qID,
        type: 'DELETE',
        success: () => {


            var self = this;
                $.getJSON("/questions/", function (jsondata) {
                    self.questions = jsondata;
                    self.FAQbyCat = jsondata;
             $('#updateQuestionModal').modal('hide');
                });
            
        }
    });


},
getUserQuestions(username){

    $.ajax({
        url: '/questions/user/' + username,
        type: 'GET',
        success: (userQuestion) => {

            self = this;

                $.getJSON("/questions/user/" + username , function (jsondata) {
                    JSON.stringify(jsondata);
                    self.userQuestion = jsondata;
                    self.question = jsondata;
                    self.FAQbyCat = jsondata;
                    self.FaqbyCat = jsondata;
                    $('#multiCollapseExample1').collapse('show'); 
                });
        
               
        }

    });
},
// Resets the FAQbyCat with all the questions so the dropdown can have a selection called all to be able to see all questions
getQuestions(){ 

    var self = this;
    
    $.getJSON("/questions/", function (jsondata) {
        self.FAQbyCat = jsondata;
        self.questions = jsondata;
       

     });
     $.getJSON("/questions/allCategories", function (jsondata) {
        JSON.stringify(jsondata);
        self.categories = jsondata;
    });
 },
 // Resets the FAQbyCat with all the questions so the dropdown can have a selection called all to be able to see all questions
getQuestionsForFaq(){ 

    var self = this;
    
    $.getJSON("/questions/", function (jsondata) {
        self.faq = jsondata;
        self.questions = jsondata;
        self.FaqbyCat = jsondata;
    

     });
     $.getJSON("/questions/allCategories", function (jsondata) {
        JSON.stringify(jsondata);
        self.categories = jsondata;
    });
 },
//////////////////Answer Start//////////////////////////////////////////////
        // WORKS
        upVote(answerID) {
                
            $.ajax({
                url: '/question/answer/upvote/' + answerID,
                type: 'PUT',
                success: (answer) => {

               // this.answer = answer.upVote; 
               this.getAnswers();



                }
            });

        },

        // WORKS
        downVote(answerID) {
                
            $.ajax({
                url: '/question/answer/downvote/' + answerID,
                type: 'PUT',
                success: (answer) => {

                   // this.answer = answer.downVote; 
                    this.getAnswers();
                
                }
            });

        },
              //show details about a user in the update modal, WORKS

              getAnswer(id) {
            
                $.ajax({
                    url: '/question/answer/' + id,
                    type: 'GET',
                    success: (answer) => {
                        self = this;
                        self.answer = answer[0];
                        try {
                            
                            self.answer = answer;

                        } catch (error) {
                            console.log(error)
                        }             
                    }
                });
                    
            },
            getAnswerForFaqs(id) {
            
                $.ajax({
                    url: '/question/answer/' + id,
                    type: 'GET',
                    success: (FAQanswer) => {
                        self = this;
                        self.FAQanswer = FAQanswer[0];
                        try {
                            
                            self.FAQanswer = FAQanswer;

                        } catch (error) {
                            console.log(error)
                        }             
                    }
                });
                    
            },
            getFaqfromCat(category){ /////WORKS
       
                $.ajax({
                    url: '/questions/filter/'+ category,
                    type: 'GET',
                    success: (FaqbyCat) => {
            
                        if(!FaqbyCat){
                            $.getJSON("/questions/", function (jsondata) {
                                JSON.stringify(jsondata);
                                this.FaqbyCat = jsondata;
                            });
                        }else{
                     
                            this.FaqbyCat = FaqbyCat;
                        }
                    }
                });
                   $('#multiCollapseExample1').collapse('show'); 
            },
            
      //show details about a user in the update modal, WORKS
      showAnswerForm(id) {
             
        $.ajax({
            url: '/question/' + id,
            type: 'GET',
            success: (question) => {
                
                this.question = question;
             
                $('#qIDs').val(question.qID);
                 $('#answerQuestionModal').modal('show'); 
            }
        });
        
    },
         answerQuestion() {
                        
             var answer = {

                 id:$('#answerQuestionModal #qIDs').val(),
                 text: $('#answerQuestionModal #text').val()

                 }

                 $.ajax({
                     //'/question/:id/answer/:username
                     url: '/question/answer/' + this.currentLoggedInUser.user.username,
                     type: 'POST',
                     data: answer,
                     success: (data) => {

                         var self = this;

                         if(data == false){

                            alert("Need to write in textfield");

                         }else {
                            $.getJSON("/answers/", function (jsondata) {
                                self.answers = jsondata;
                                $('#answerQuestionModal').modal('hide');
                            });
                         }
                        
                     }
                 });
             },
             showAnswerInUpdateForm(id) {
           
                $.ajax({
                    url: '/answer/' + id,
                    type: 'GET',
                    success: (answer) => {
                        this.answer = answer;
                        
                          
                        $('#answerID').val(answer.answerID);
                        $('#username').val(answer.username);
                        $('#text').val(answer.answerText);
        
                    }
                });
                   $('#updateAnswerModal').modal('show'); 
            },
            updateAnswer(){
        
            let answer = {

                username: $('#updateAnswerModal #username').val(),
                answerText: $('#updateAnswerModal #text').val(),
                answerID: $('#updateAnswerModal #answerID').val()
        
            };
           
            $.ajax({
                url: '/updateAnswer/' + answer.answerID,
                type: 'PATCH',
                data: answer,
                success: () => {
        
                    var self = this;
                        $.getJSON("/answers/", function (jsondata) {
                            self.answers = jsondata;
                     $('#updateAnswerModal').modal('hide');
                        });
                    
                
                    
                }
        
            });
        
        },
        deleteAnswer() { //, WORKD

            var a = {
                qID: $('#updateAnswerModal #answerID').val()
            }
        
            $.ajax({
                url: '/answer/delete/' + a.qID,
                type: 'DELETE',
                success: () => {
        
        
                    var self = this;
                        $.getJSON("/answers/", function (jsondata) {
                            self.answers = jsondata;
                           
                     $('#updateAnswerModal').modal('hide');
                        });
                    
                }
            });
        
        
        },
                

//////////////////Answer End//////////////////////////////////////////////
        
        resetMessage() {
            this.messageToUser = "";
            this.msg="";        
        },
        showAll(){

            this.getUsers();
        },
        getUsers(){

            var self = this;
            
            $.getJSON("/api/users/", function (jsondata) {
                self.users = jsondata;
             });
         },
         getAnswers(){

            var self = this;
            
            $.getJSON("/answers/", function (jsondata) {
                self.answers = jsondata;
             });
         },
         logOut() {
            this.currentLoggedInUser = [];
            messageToUser = "You have been logged out";
            currentLoggedInUser = false;
            window.location.href = '/api/logout/';
    
        },

    },

    
    computed: {
        
        
        isConsumerOrSuperAdmin() {
            if (this.currentLoggedInUser.user.role == "Super Admin" || this.currentLoggedInUser.user.role == "Consumer") {
                return true;
            } else {
                return false
            };
        },

        isContributorOrSuperAdmin() {
            if (this.currentLoggedInUser.user.role == "Contributor" || this.currentLoggedInUser.user.role == "Super Admin") {
                return true
            } else {
                false
            };
        },

        userIsLoggedIn() {
            var self = this;
            if (self.currentLoggedInUser == null) {

                return false;
            } else {
                return true;
            };
        }




    },




///////////////////// mounted()//////////////////////////////////////
    mounted() {


        

        var self = this;

        
        $.getJSON("/questions/allCategories", function (jsondata) {
            JSON.stringify(jsondata);
            self.categories = jsondata;
        });
        
        $.getJSON("/questions/faq", function (jsondata) {
            JSON.stringify(jsondata);
            self.faqs = jsondata;
        });

        $.getJSON("/questions/", function (jsondata) {
            JSON.stringify(jsondata);
            self.questions = jsondata;
            self.FAQbyCat = jsondata;
            self.FaqbyCat = jsondata;
           
        });

        $.getJSON('/api/users/', function (jsondata) {

            JSON.parse(JSON.stringify(jsondata));
            self.users = jsondata;
        });

        $.getJSON('/answers/', function (jsondata) {

            JSON.parse(JSON.stringify(jsondata));
            self.answers = jsondata;
        });

        $.getJSON("/question/answer/" + self.answers.answerID, function (jsondata) {
            self.answer = jsondata;
         });

        $.getJSON('/api/contributors/', function (jsondata) {

            JSON.parse(JSON.stringify(jsondata));
            self.contributors = jsondata;
        });


        $.getJSON('/api/loggedinuser/', function (jsondata) {

            JSON.stringify(jsondata);


            if (self.currentLoggedInUser.role == 'Super Admin' || self.currentLoggedInUser.role == 'Consumer') {
                $.getJSON('/questions/user/' + self.currentLoggedInUser.username , function (jsondata) { //fixa tbx till hur det ska va nedan, se kod längst ner
                    console.log(jsondata);
                    self.userQuestion = jsondata;
                    self.FAQbyCat = jsondata;
                    self.FaqbyCat = jsondata;
                });
            };


            self.currentLoggedInUser = jsondata;
        });




    }
});