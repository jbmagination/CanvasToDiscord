"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { webhookSettings, canvasSettings } = require('../../config.json');
const discord_js_1 = require("discord.js");
const xml2js_1 = require("xml2js");
const _ = __importStar(require("underscore"));
const axios_1 = __importDefault(require("axios"));
const turndown_1 = __importDefault(require("turndown"));
const common_1 = require("../common");
var turndownService = new turndown_1.default();
(0, common_1.commonRules)(turndownService);
const webhookClient = new discord_js_1.WebhookClient({ url: webhookSettings.webhookUrl });
let updatedMsg;
let updatedTitle;
let editedTitle;
let validEdit;
let prevFeed = JSON.parse('[]');
function checkUpdates() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('checkUpdates ran');
        yield canvasSettings.canvasFeeds.forEach((feed) => {
            (0, common_1.feedRules)(turndownService, feed.feedUrl);
            (0, axios_1.default)(feed.feedUrl)
                .then((response) => {
                (0, xml2js_1.parseString)(response.data, (err, feed) => {
                    feed.feed.entry.forEach((item, index) => {
                        var _a, _b, _c, _d, _e, _f;
                        if ((prevFeed[index]) && (prevFeed[index].link[0].$.href == item.link[0].$.href)) {
                            editedTitle = turndownService.turndown((_a = item.title[0]) === null || _a === void 0 ? void 0 : _a.substring(14));
                            if (!(_.isEqual(turndownService.turndown((_b = item.title[0]) === null || _b === void 0 ? void 0 : _b.substring(14)), turndownService.turndown((_c = prevFeed[index].title[0]) === null || _c === void 0 ? void 0 : _c.substring(14))))) {
                                editedTitle = `${turndownService.turndown((_d = prevFeed[index].title[0]) === null || _d === void 0 ? void 0 : _d.substring(14))}`;
                                updatedTitle = `\n**Updated title**: "${turndownService.turndown((_e = item.title[0]) === null || _e === void 0 ? void 0 : _e.substring(14))}"`;
                                validEdit = true;
                            }
                            if (!(_.isEqual(turndownService.turndown(item.content[0]._), turndownService.turndown(prevFeed[index].content[0]._)))) {
                                updatedMsg = `\n**Updated description**: \n${turndownService.turndown(item.content[0]._)}`;
                                validEdit = true;
                            }
                            if (validEdit) {
                                webhookClient.send({
                                    content: `__**ANNOUNCEMENT EDITED:** [${editedTitle}](${item.link[0].$.href})__${updatedTitle}${updatedMsg}`,
                                });
                                validEdit = false;
                            }
                            updatedTitle = '';
                            updatedMsg = '';
                            validEdit = false;
                        }
                        else {
                            if ((!(prevFeed[index])) || (index == 0)) {
                                webhookClient.send({
                                    content: `__**NEW ANNOUNCEMENT:** [${turndownService.turndown((_f = item.title[0]) === null || _f === void 0 ? void 0 : _f.substring(14))}](${item.link[0].$.href})__\n${turndownService.turndown(feed.feed.entry[index].content[0]._)}`
                                });
                                prevFeed[index] = feed.feed.entry[index];
                            }
                        }
                        prevFeed[index] = feed.feed.entry[index];
                    });
                });
            });
        });
        setTimeout(checkUpdates, 15000);
    });
}
canvasSettings.canvasFeeds.forEach((feed) => __awaiter(void 0, void 0, void 0, function* () {
    (0, axios_1.default)(feed.feedUrl)
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        (0, xml2js_1.parseString)(response.data, (err, feed) => __awaiter(void 0, void 0, void 0, function* () {
            feed.feed.entry.forEach((entry, index) => __awaiter(void 0, void 0, void 0, function* () {
                yield (prevFeed[index] = feed.feed.entry[index]);
                if (feed.feed.entry.length - 1 == index)
                    checkUpdates();
            }));
        }));
    }));
}));
//# sourceMappingURL=webhook.js.map