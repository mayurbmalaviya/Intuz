const express = require(`express`);
const router = express.Router();
const jwt = require(`jsonwebtoken`);
const DBManager = require('../helpers/db_manager');

const user = require(`./user`);

let authenticateMiddleware = async (req,res,next) => {
    try {
        let token = req.headers.token;
        let decode;
        if(token) {
            decode = jwt.verify(token, 'privatekey');
           
            req.headers.id = decode.id;

            connection = await DBManager.getProxyNodeConnection();

            let [result] = await connection.query(`SELECT * FROM User where id = ${decode.id}`);
            
            connection.release();
            connection = null;
            
            if(result.length) {
                next();
            }else {
                return res.status(400).send({Success : false, Message: "Session expired!!!"});            
            }
        } else {
           return res.status(400).send({Success : false, Message: "Session expired!!!"});
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send({Success: false, Message : e});
    }
}

router.post('/', user.registerUser);
router.post('/login', user.login);
router.put('/user/:id', authenticateMiddleware, user.editUser);
router.get('/user', authenticateMiddleware, user.getUsers);
router.delete('/user/:id',authenticateMiddleware, user.deleteUser);

module.exports = (app) => {
    app.use(`/intuz`,router);
}