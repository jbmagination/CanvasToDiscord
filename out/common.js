"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedRules = exports.commonRules = void 0;
function commonRules(turndownService) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.commonRules = commonRules;
function feedRules(turndownService, feedUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        turndownService.addRule('imageFixer', {
            filter: 'img',
            replacement: function (content, node) {
                if (node.getAttribute('data-equation-content')) {
                    return `([math equation](<https://www.wolframalpha.com/input?i=${encodeURI(node.getAttribute('data-equation-content'))}>), link to Wolfram Alpha)`;
                }
                else {
                    return `([attached image](${new URL(feedUrl).protocol}//${new URL(feedUrl).host}/${node.getAttribute('src').substring(1)}))`;
                }
            }
        });
        turndownService.addRule('iframeFixer', {
            filter: 'iframe',
            replacement: function (content, node) {
                if (node.getAttribute('src').startsWith('/')) {
                    return `[${content}](<${new URL(feedUrl).protocol}//${new URL(feedUrl).host}/${node.getAttribute('src').substring(1)}>)`;
                }
                else {
                    return `[${content}](<${node.getAttribute('src')}>)`;
                }
            }
        });
        turndownService.addRule('linkFixer', {
            filter: 'a',
            replacement: function (content, node) {
                if (node.getAttribute('href').startsWith('/')) {
                    return `[${content}](<${new URL(feedUrl).protocol}//${new URL(feedUrl).host}/${node.getAttribute('href').substring(1)}>)`;
                }
                else {
                    return `[${content}](<${node.getAttribute('href')}>)`;
                }
            }
        });
    });
}
exports.feedRules = feedRules;
//# sourceMappingURL=common.js.map