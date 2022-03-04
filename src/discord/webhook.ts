const { webhookSettings, canvasSettings } = require('../../config.json')
import { WebhookClient } from 'discord.js';
import { parseString } from 'xml2js';
import * as _ from 'underscore';
import axios from 'axios';

import TurndownService from 'turndown';
import { commonRules, feedRules } from '../common';
var turndownService = new TurndownService()
commonRules(turndownService);

const webhookClient = new WebhookClient({ url: webhookSettings.webhookUrl });

let updatedMsg: string | undefined;
let updatedTitle: string | undefined;
let editedTitle: string | undefined;
let validEdit: boolean;
let prevFeed = JSON.parse('[]');

async function checkUpdates() {
    console.log('checkUpdates ran')
    await canvasSettings.canvasFeeds.forEach((feed: any) => {
        feedRules(turndownService, feed.feedUrl)
        axios(feed.feedUrl)
        .then((response: any) => {
            parseString(response.data, (err: any, feed: any) => {
                feed.feed.entry.forEach((item: any, index: any) => {
                    if ((prevFeed[index]) && (prevFeed[index].link[0].$.href == item.link[0].$.href)) {
                        editedTitle = turndownService.turndown(item.title[0]?.substring(14)!)
                        if (!(_.isEqual(turndownService.turndown(item.title[0]?.substring(14)!), turndownService.turndown(prevFeed[index].title[0]?.substring(14))))) {
                            editedTitle = `${turndownService.turndown(prevFeed[index].title[0]?.substring(14))}`
                            updatedTitle = `\n**Updated title**: "${turndownService.turndown(item.title[0]?.substring(14)!)}"`
                            validEdit = true;
                        }
                        if (!(_.isEqual(turndownService.turndown(item.content[0]._!), turndownService.turndown(prevFeed[index].content[0]._)))) {
                            updatedMsg = `\n**Updated description**: \n${turndownService.turndown(item.content[0]._!)}`
                            validEdit = true;
                        }
                        if (validEdit) {
                            webhookClient.send({
                                content: `__**ANNOUNCEMENT EDITED:** [${editedTitle}](${item.link[0].$.href})__${updatedTitle}${updatedMsg}`,
                            })
                            validEdit = false;
                        }
                
                        updatedTitle = '';
                        updatedMsg = '';
                        validEdit = false;
                    } else {
                        if ((!(prevFeed[index])) || (index == 0)) {
                            webhookClient.send({
                                content: `__**NEW ANNOUNCEMENT:** [${turndownService.turndown(item.title[0]?.substring(14)!)}](${item.link[0].$.href})__\n${turndownService.turndown(feed.feed.entry[index].content[0]._!)}`
                            })
                            prevFeed[index] = feed.feed.entry[index];
                        }
                    }
                    prevFeed[index] = feed.feed.entry[index];
                })
            })
        })
    })
    setTimeout(checkUpdates, 15000)
}

canvasSettings.canvasFeeds.forEach(async (feed: any) => {
    axios(feed.feedUrl)
    .then(async (response: any) => {
        parseString(response.data, async (err: any, feed: any) => {
            feed.feed.entry.forEach (async (entry: any, index: any) => {
                await (prevFeed[index] = feed.feed.entry[index]);
                if (feed.feed.entry.length-1 == index) checkUpdates()
            })
        })
    })
})