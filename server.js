const body_parser = require(`body-parser`);
require('./helpers/globals');

const PORT = process.env.PORT || global.CONFIG.server.port;

const app = require(`./intuz`);

const server = app.listen(PORT, () => {
    console.log(`${PORT} is ready to listen...`);   
});
	
server.timeout = 300000;
