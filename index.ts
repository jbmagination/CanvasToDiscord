const { canvasFeed, webhookUrl } = require('./config.json')
import { WebhookClient } from 'discord.js';
import Parser from 'rss-parser';
import TurndownService from 'turndown';
import * as _ from 'underscore';
var turndownService = new TurndownService()


turndownService.addRule('imageFixer', { 
    filter: 'img', 
    replacement: function (content: string, node: any) {
        if (node.getAttribute('data-equation-content')) {
            return `([math equation](<https://www.wolframalpha.com/input?i=${encodeURI(node.getAttribute('data-equation-content'))}>), link to Wolfram Alpha)`
        } else {
            return `([attached image](${new URL(canvasFeed).protocol}//${new URL(canvasFeed).host}/${node.getAttribute('src').substring(1)}))` 
        }
    } 
})

turndownService.addRule('tableFilter', { filter: 'table', replacement: function () { return '(table)' } })

turndownService.addRule('spanFixer', { 
    filter: 'span', 
    replacement: function (content: string, node: any) { 
        if (node.getAttribute('style') == 'text-decoration: underline;') {
            return `__${content}__` 
        }
        else if (node.getAttribute('style') == 'text-decoration: line-through;') {
            return `~~${content}~~` 
        }
        else {
            return `${content}` 
        }
    } 
})

turndownService.addRule('iframeFixer', { 
    filter: 'iframe', 
    replacement: function (content: string, node: any) { 
        if (node.getAttribute('src').startsWith('/')) {
            return `[${content}](${new URL(canvasFeed).protocol}//${new URL(canvasFeed).host}/${node.getAttribute('src').substring(1)})`
        } else {
            return `[${content}](${node.getAttribute('src')})`
        }
    } 
})

turndownService.addRule('linkFixer', { 
    filter: 'a', 
    replacement: function (content: string, node: any) {
        if (node.getAttribute('href').startsWith('/')) {
            return `[${content}](${new URL(canvasFeed).protocol}//${new URL(canvasFeed).host}/${node.getAttribute('href').substring(1)})`
        } else {
            return `[${content}](${node.getAttribute('href')})`
        }
    } 
})

const parser = new Parser();
const webhookClient = new WebhookClient({ url: webhookUrl });

let updatedMsg: string | undefined;
let updatedTitle: string | undefined;
let editedTitle: string | undefined;
let validEdit: boolean;
let prevFeed: any;

function checkUpdates() {
    parser.parseURL(canvasFeed)
    .then(feed => {
        feed.items.forEach((item, index) => {
            console.log(index)
            console.log(prevFeed.items[index])
            if ((prevFeed.items[index]) && (prevFeed.items[index].link == item.link)) {
                editedTitle = turndownService.turndown(item.title?.substring(14)!)
                if (!(_.isEqual(turndownService.turndown(item.title?.substring(14)!), turndownService.turndown(prevFeed.items[index].title?.substring(14))))) {
                    editedTitle = `${turndownService.turndown(prevFeed.items[index].title?.substring(14))}`
                    updatedTitle = `\n**Updated title**: "${turndownService.turndown(item.title?.substring(14)!)}"`
                    validEdit = true;
                }
                if (!(_.isEqual(turndownService.turndown(item.content!), turndownService.turndown(prevFeed.items[index].content)))) {
                    updatedMsg = `\n**Updated description**: \n${turndownService.turndown(item.content!)}`
                    validEdit = true;
                }
                if (validEdit) {
                    webhookClient.send({
                        content: `__**ANNOUNCEMENT EDITED:** [${editedTitle}](${item.link})__${updatedTitle}${updatedMsg}`,
                    })
                    validEdit = false;
                }
        
                updatedTitle = '';
                updatedMsg = '';
                validEdit = false;
            } else {
                if ((!(prevFeed.items[index])) || (index == 0)) {
                    webhookClient.send({
                        content: `__**NEW ANNOUNCEMENT:** [${turndownService.turndown(item.title?.substring(14)!)}](${item.link})__\n${turndownService.turndown(feed.items[0].content!)}`
                    })
                    prevFeed = feed;
                }
            }
        })
        prevFeed = feed;
    }).then(() => {setTimeout(checkUpdates, 15000) })
}

parser.parseURL(canvasFeed)
    .then(feed => {
        prevFeed = feed;
        checkUpdates()
    })