const DBManager = require('../helpers/db_manager');
const {md5} = require(`../helpers/utils`);

const registerUser = async (connection, user) => {
    const query = `INSERT INTO User(firstName, lastName, email, phone, password) values('${user.FirstName}','${user.LastName}','${user.Email}','${user.Phone}','${md5(user.Password)}')`;
    let [result] = await connection.query(query);
    return result;
}

const findAll = async (connection, condition) => {
    if(!condition) {
        condition = `1=1`;
    }
    const query = `SELECT * FROM User WHERE ${condition}`;
    let [result] = await connection.query(query);

    return result;
}

const updateUser = async (connection, user, condition) =>  {
    if(!condition) {
        condition = `1=1`;
    }
    const query = `UPDATE User SET gender='${user.gender}',type='${user.type}',address='${user.address}',hobby='${user.hobby}',birthdate='${user.birthday}' WHERE ${condition}`;
   console.log(query);
    let [result] = await connection.query(query); 
    return result;
}

const deleteUser = async (connection, condition) => {
    if(!condition) {
        condition =  "1=1";
    }
    const query = `DELETE FROM User WHERE ${condition}`;
    let [result] = await connection.query(query);

    return result;
}

module.exports.registerUser = registerUser;
module.exports.findAll = findAll;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;