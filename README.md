# Canvas to Discord
A webhook that automatically posts Canvas announcements to Discord.

## Why?
A school club I'm in has an unofficial Discord, and they frequently have to post new Canvas announcements-- which sparked the idea. They thought it'd be helpful, so I made the first proof of concept in an hour, and polished said concept in five hours.

My eventual goal with this project is for it to be able to support as many features as possible that Canvas announcements have, without being cluttered.

## Compatibility list
As more apps are tested, this list will inevitably get longer. Please see `COMPATIBILITY.md`.

## Setup
1. Rename `config.replace.json` to `config.json`
2. Go to your Canvas page of choice
3. Under the "Announcements" tab, open "External Feeds"
4. Copy the link for "RSS Feed"
5. Put the link into `"[put-canvas-feed-here]"`
6. Go to your Discord channel's settings
7. Under the "Integrations" tab, either...
    a. press the "Create Webhook" button
    b. choose "View Webhooks", then press the "New Webhook" button
8. Copy the webhook URL
9. Put the URL into `"[put-webhook-url-here]"`
10. `npm ci`
11. `tsc`
12. `node index`

## Plans
* Support Canvas API
* Support multiple Canvas announcement feeds
* Support Discord bot instead of webhook
* Support Canvas reply feeds
