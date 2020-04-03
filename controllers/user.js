const DBManager = require(`../helpers/db_manager`);
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const {md5} = require(`../helpers/utils`);
const Joi = require('joi');
 
const registerUser = async(req,res) => {
    let connection;
    try {
       let user = {
            FirstName : req.body.FirstName,
            LastName : req.body.LastName,
            Email : req.body.Email,
            Phone : req.body.Phone,
            Password : req.body.Password
        }

        const userSchema = Joi.object().keys({
            FirstName: Joi.string().required(),
            LastName: Joi.string().required(),
            Email: Joi.string().email({ minDomainAtoms: 2 }),
            Phone : Joi.number().required(),
            Password: Joi.string().required()
        })

        const validateResult = Joi.validate(user, userSchema);

        if(validateResult.error) {
            return res.status(500).send({Success:false,Message : validateResult.error});
        }


        
        connection = await DBManager.getProxyNodeConnection();

        connection.beginTransaction();
        let result = await userModel.registerUser(connection, user);
        connection.commit();

        connection.release();
        connection = null;
        
        return res.status(200).send({Success : true, Message: "Insert successful"});
    } catch(e) {
        console.log(e);
        if(connection) {
            connection.rollback();
            connection.release();
            connection = null;
        }
        return res.status(500).send({Success : false, Message : e});
    }
}

const login = async (req,res) => {
    let connection;
    try {
        let userDetail = {
            email : req.body.Email,
            password : req.body.Password
        }
        const userDetailSchema = Joi.object().keys({
            email: Joi.string().email({ minDomainAtoms: 2 }),
            password: Joi.string().required(),
        })

        const validateResult = Joi.validate(userDetail, userDetailSchema);

        if(validateResult.error) {
            return res.status(500).send({Success:false,Message : validateResult.error});
        }
    
        connection = await DBManager.getProxyNodeConnection();

        let [result] = await userModel.findAll(connection, `email = '${userDetail.email}' and password = '${md5(userDetail.password)}'`);
        connection.release();
        connection = null;
        console.log(result);

        let token;
        if(result) {
            token = jwt.sign({ id : result.id}, 'privatekey');
            return res.status(200).send({Success : true, Token : token});
        } else {
            return res.status(400).send({Success: false, Message : "User doesn't exist"});
        }       
    } catch(e) {
        console.log(e);
        if(connection) {
            connection.release();
            connection = null;
        }
        return res.status(500).send({Success : false, Message : e});
    }
}

const editUser = async(req,res) => {
    console.log(req.params.id);
    let connection;
    try {
        connection = await DBManager.getProxyNodeConnection();
        let user = {
            gender : req.body.gender,
            type : req.body.type,
            address : req.body.address,
            hobby : req.body.hobby,
            birthday : req.body.birthday
        }

        const userDetailSchema = Joi.object().keys({
            gender: Joi.string().required(),
            type: Joi.string().required(),
            address:Joi.string().required(),
            hobby:Joi.required(),
            birthday: Joi.date().required()
        })

        const validateResult = Joi.validate(user, userDetailSchema);

         if(validateResult.error) {
            return res.status(500).send({Success:false,Message : validateResult.error});
        }
    
        
        connection.beginTransaction();
        
        let result = await userModel.updateUser(connection, user, `id = ${req.params.id}`);
        console.log(user);
        connection.commit();
        console.log(result);
        if(result) {
            return res.status(200).send({Success : true, Data : result});
        }
        connection.release();
        connection = null;

    } catch(e) {
        if(connection) {
            connection.rollback();
            connection.release();
            connection = null;    
        }
        return res.status(500).send({Success : true, Message: e});
    }
}

const getUsers = async(req,res) => {
    let connection;
    try {   
        connection = await DBManager.getProxyNodeConnection();
        let result = await userModel.findAll(connection);
        connection.release();
        connection = null;
        res.status(200).send(result);
    } catch(e) {
        if(connection) {
            connection.release();
            connection = null;
        }
    }
}

const deleteUser = async(req,res) => {
    console.log(`delete`);
    let connection;
    try {
        let id = req.params.id;

        let userDetail = {
            id : req.params.id
        }
        const userDetailSchema = Joi.object().keys({
            id : Joi.number().required()
        })

        const validateResult = Joi.validate(userDetail, userDetailSchema);

        if(validateResult.error) {
            return res.status(500).send({Success:false,Message : validateResult.error});
        }

        connection = await DBManager.getProxyNodeConnection();
        connection.beginTransaction();
        let result = await userModel.deleteUser(connection,`id = ${id}`);
        connection.commit();
        connection.release();
        connection = null;
        console.log(result);
        res.status(200).send({Success : true, Message : "Delete Successful!!!"});
    } catch(e) {
        if(connection) {
            connection.rollback();
            connection.release();
            connection = null;
        }
        res.status(500).send({Success : false, Message: e});
    }
}

module.exports.registerUser = registerUser;
module.exports.login = login;
module.exports.editUser = editUser;
module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;