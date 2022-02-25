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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { canvasFeed, webhookUrl } = require('./config.json');
const discord_js_1 = require("discord.js");
const rss_parser_1 = __importDefault(require("rss-parser"));
const turndown_1 = __importDefault(require("turndown"));
const _ = __importStar(require("underscore"));
var turndownService = new turndown_1.default();
turndownService.addRule('imageFixer', {
    filter: 'img',
    replacement: function (content, node) {
        if (node.getAttribute('data-equation-content')) {
            return `([math equation](<https://www.wolframalpha.com/input?i=${encodeURI(node.getAttribute('data-equation-content'))}>), link to Wolfram Alpha)`;
        }
        else {
            return `([attached image](${new URL(canvasFeed).protocol}//${new URL(canvasFeed).host}/${node.getAttribute('src').substring(1)}))`;
        }
    }
});
turndownService.addRule('tableFilter', { filter: 'table', replacement: function () { return '(table)'; } });
turndownService.addRule('spanFixer', {
    filter: 'span',
    replacement: function (content, node) {
        if (node.getAttribute('style') == 'text-decoration: underline;') {
            return `__${content}__`;
        }
        else if (node.getAttribute('style') == 'text-decoration: line-through;') {
            return `~~${content}~~`;
        }
        else {
            return `${content}`;
        }
    }
});
turndownService.addRule('iframeFixer', {
    filter: 'iframe',
    replacement: function (content, node) {
        if (node.getAttribute('src').startsWith('/')) {
            return `[${content}](${new URL(canvasFeed).protocol}//${new URL(canvasFeed).host}/${node.getAttribute('src').substring(1)})`;
        }
        else {
            return `[${content}](${node.getAttribute('src')})`;
        }
    }
});
turndownService.addRule('linkFixer', {
    filter: 'a',
    replacement: function (content, node) {
        if (node.getAttribute('href').startsWith('/')) {
            return `[${content}](${new URL(canvasFeed).protocol}//${new URL(canvasFeed).host}/${node.getAttribute('href').substring(1)})`;
        }
        else {
            return `[${content}](${node.getAttribute('href')})`;
        }
    }
});
const parser = new rss_parser_1.default();
const webhookClient = new discord_js_1.WebhookClient({ url: webhookUrl });
let updatedMsg;
let updatedTitle;
let editedTitle;
let validEdit;
let prevFeed;
function checkUpdates() {
    parser.parseURL(canvasFeed)
        .then(feed => {
        feed.items.forEach((item, index) => {
            var _a, _b, _c, _d, _e, _f;
            console.log(index);
            console.log(prevFeed.items[index]);
            if ((prevFeed.items[index]) && (prevFeed.items[index].link == item.link)) {
                editedTitle = turndownService.turndown((_a = item.title) === null || _a === void 0 ? void 0 : _a.substring(14));
                if (!(_.isEqual(turndownService.turndown((_b = item.title) === null || _b === void 0 ? void 0 : _b.substring(14)), turndownService.turndown((_c = prevFeed.items[index].title) === null || _c === void 0 ? void 0 : _c.substring(14))))) {
                    editedTitle = `${turndownService.turndown((_d = prevFeed.items[index].title) === null || _d === void 0 ? void 0 : _d.substring(14))}`;
                    updatedTitle = `\n**Updated title**: "${turndownService.turndown((_e = item.title) === null || _e === void 0 ? void 0 : _e.substring(14))}"`;
                    validEdit = true;
                }
                if (!(_.isEqual(turndownService.turndown(item.content), turndownService.turndown(prevFeed.items[index].content)))) {
                    updatedMsg = `\n**Updated description**: \n${turndownService.turndown(item.content)}`;
                    validEdit = true;
                }
                if (validEdit) {
                    webhookClient.send({
                        content: `__**ANNOUNCEMENT EDITED:** [${editedTitle}](${item.link})__${updatedTitle}${updatedMsg}`,
                    });
                    validEdit = false;
                }
                updatedTitle = '';
                updatedMsg = '';
                validEdit = false;
            }
            else {
                if ((!(prevFeed.items[index])) || (index == 0)) {
                    webhookClient.send({
                        content: `__**NEW ANNOUNCEMENT:** [${turndownService.turndown((_f = item.title) === null || _f === void 0 ? void 0 : _f.substring(14))}](${item.link})__\n${turndownService.turndown(feed.items[0].content)}`
                    });
                    prevFeed = feed;
                }
            }
        });
        prevFeed = feed;
    }).then(() => { setTimeout(checkUpdates, 15000); });
}
parser.parseURL(canvasFeed)
    .then(feed => {
    prevFeed = feed;
    checkUpdates();
});
