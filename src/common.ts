async function commonRules(turndownService: any) {
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
}

async function feedRules(turndownService: any, feedUrl: string) {
    turndownService.addRule('imageFixer', { 
        filter: 'img', 
        replacement: function (content: string, node: any) {
            if (node.getAttribute('data-equation-content')) {
                return `([math equation](<https://www.wolframalpha.com/input?i=${encodeURI(node.getAttribute('data-equation-content'))}>), link to Wolfram Alpha)`
            } else {
                return `([attached image](${new URL(feedUrl).protocol}//${new URL(feedUrl).host}/${node.getAttribute('src').substring(1)}))` 
            }
        } 
    })

    turndownService.addRule('iframeFixer', { 
        filter: 'iframe', 
        replacement: function (content: string, node: any) { 
            if (node.getAttribute('src').startsWith('/')) {
                return `[${content}](<${new URL(feedUrl).protocol}//${new URL(feedUrl).host}/${node.getAttribute('src').substring(1)}>)`
            } else {
                return `[${content}](<${node.getAttribute('src')}>)`
            }
        } 
    })

    turndownService.addRule('linkFixer', { 
        filter: 'a', 
        replacement: function (content: string, node: any) {
            if (node.getAttribute('href').startsWith('/')) {
                return `[${content}](<${new URL(feedUrl).protocol}//${new URL(feedUrl).host}/${node.getAttribute('href').substring(1)}>)`
            } else {
                return `[${content}](<${node.getAttribute('href')}>)`
            }
        } 
    })
}

export { commonRules, feedRules };