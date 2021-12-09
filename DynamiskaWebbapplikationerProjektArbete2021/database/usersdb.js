
// require sqlite to be able to use CRUD-OPERATIONS on our database
const dbPromise = require('./dbSetup');
const bcrypt = require('../crypt.js');




const getAllUsers = async() => {

    try {
        const dbCon = await dbPromise;
        const users = await dbCon.all("SELECT role,username,status,id FROM users ORDER by id ASC");
        return users;
    } catch (error) {
        console.log('Something went wrong in the getUserByUsername function in users db.')
    }
};



const getUserByUsername = async(data) => {

    try {
        const dbCon = await dbPromise;
        const user = await dbCon.all("SELECT role, username, status, id  FROM users WHERE username = ?", [data.username]);

        return user;
    } catch (error) {
        console.log('Something went wrong in the getUserByUsername function in users db.')
    }
};




const getTheUserByUsername = async(data) => {

    try {
        const dbCon = await dbPromise;
        const user = await dbCon.get("SELECT role, username, status, id  FROM users WHERE username = ?", [data]);

        return user;
    } catch (error) {
        console.log('Something went wrong in the getUserByUsername function in users db.')
    }
};


//lägga till en contributor
const addContributor = async (data) => {
    
    const role = "Contributor";
    const status = "Active";

    try {

        if(!data.password){
            return false;
        }else{
            let create = await bcrypt.createPassword(data.password);
            const sqlQuery = 'INSERT INTO users (role, username, password, status) VALUES (?,?,?,?)';
            const db = await dbPromise;
            return db.run(sqlQuery, role, data.username, create, status);
        }
    } catch (error) {
        throw new Error(error);
    }
}

const addUser = async (data) => {
    try {
        status = 'Active';
        //status = 'Banned'
        const sqlQuery = 'INSERT INTO users ( role, username, password,status ) VALUES (?,?,?,?)';
        const db = await dbPromise;
        let create = await bcrypt.createPassword(data.password);
        return db.run(sqlQuery, data.role, data.username,  create, status);
    } catch (error) {
        //throw new Error(error);
        console.log('Error when tryinf to add user in the usersdb.js')
    }
}

//LOGIN METHOD
const doLogin = async (data)=>{
    try{
        const dbCon = await dbPromise;
        const login = await dbCon.get("SELECT password FROM users WHERE username= ?",[data.username]);
       

        compares = await bcrypt.compPass(data.password, login.password);
  
        if(!compares){
            return false;
        }else{
            return login;
        }
         
    }
    catch(error){
        console.log("Wrong credentials, check username and password.");
        return false;
    }
}
//hämta contributors
const getContributors = async (Contributor) => {
    try {
        const dbConnection = await dbPromise;
        const contributors = await dbConnection.all("SELECT role, username, status, id FROM users WHERE role = 'Contributor'", [Contributor]);
        return contributors;
    }
    catch (error) {
        throw new Error('something went wrong');
    }
};



//uppdatera en contributors information
const updateUser = async (id, data) => {//updaterar produkt i databasen via id
    try {
        const dbCon = await dbPromise;
        const user = dbCon.run('UPDATE users SET role = ?, username = ?, status = ? WHERE id = ?', [data.role, data.username, data.status, id]);
    }
    catch (error) {
        throw new Error('Gick det inte att uppdatera användaren med valt ID');
    }
};


//userState METHOD. To be able to know if user is banned or not
const userState = async (data)=>{
    try{
        const dbCon = await dbPromise;
        var stateData = await dbCon.get("SELECT status FROM users WHERE username= ?",[data.username]);

        return stateData;
        
         
    }
    catch(error){
        console.log("Banned, cannot login");
        
    }
}

//uppdatera en contributors information
const bannUser = async (username) => {//updaterar produkt i databasen via id
    try {
        const status = "Banned";
        const dbCon = await dbPromise;
        const user = dbCon.run('UPDATE users SET status = ? WHERE username = ?', [status, username]);
        return user;
    }
    catch (error) {
        throw new Error('Gick det inte att uppdatera användaren med valt ID');
    }
};

//uppdatera en contributors information
const unBannUser = async (username) => {//updaterar produkt i databasen via id
    try {
        const status = "Active";
        const dbCon = await dbPromise;
        const user = dbCon.run('UPDATE users SET status = ? WHERE username = ?', [status, username]);
        return user;
    }
    catch (error) {
        throw new Error('Gick det inte att uppdatera användaren med valt ID');
    }
};


const deleteUser = async (id) => {
    try {
        const sqlQuery = 'DELETE FROM users where id = ?';
        const db = await dbPromise;
        return db.run(sqlQuery, id);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {

    getAllUsers:getAllUsers,
    getUserByUsername:getUserByUsername,
    addUser: addUser,
    doLogin:doLogin,
    getContributors:getContributors,
    addContributor:addContributor,
    updateUser:updateUser,
    userState:userState,
    getTheUserByUsername:getTheUserByUsername,
    bannUser:bannUser,
    deleteUser:deleteUser,
    unBannUser:unBannUser,


};