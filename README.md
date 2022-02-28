# Canvas to Discord
## What?
This project currently posts Canvas announcements to Discord. My eventual goal with this project is for it to be able to support as many of Canvas's features as possible without being cluttered.

## Why?
A school club I'm in has an unofficial Discord, and they frequently have to post new Canvas announcements-- which sparked the idea. They thought it'd be helpful, so I made the first proof of concept in an hour, and polished said concept in five hours.

## How?
1. Rename `config.replace.json` to `config.json`
2. Go to your Canvas page of choice
3. Under the "Announcements" tab, open "External Feeds"
4. Copy the link for "RSS Feed"
5. Put the link into `"[put-canvas-feed-here]"`
6. Go to your Discord channel's settings
7. Under the "Integrations" tab, either...
    1. press the "Create Webhook" button
    2. choose "View Webhooks", then press the "New Webhook" button
8. Copy the webhook URL
9. Put the URL into `"[put-webhook-url-here]"`
10. `npm ci`
11. `tsc`
12. `node index`

Please be aware that not everything will work; see `COMPATIBILITY.md` for a rundown.

## Extras?
### Plans
* Support Canvas API
* Support multiple Canvas announcement feeds
* Support Discord bot instead of webhook
* Support Canvas reply feeds
* 

### License
    Canvas to Discord
    Copyright (C) 2022  JBMagination

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
