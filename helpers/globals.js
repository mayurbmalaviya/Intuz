let ENVIRONMENT = process.env.NODE_ENV;
if(ENVIRONMENT === '' || ENVIRONMENT === undefined) {
    ENVIRONMENT = 'development';
}

global.ENVIRONMENT = ENVIRONMENT;
global.ROOT_PATH = __dirname+'/..';
global.CONFIG = require('../config/' + ENVIRONMENT + '.js');
