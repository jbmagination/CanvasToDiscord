"use strict";
const { webhook } = require('../config.json');
if (webhook == true) {
    console.log('Loading webhook...');
    require('./discord/webhook');
}
else {
    console.log('Loading bot...');
    require('./discord/bot');
}
//# sourceMappingURL=index.js.map