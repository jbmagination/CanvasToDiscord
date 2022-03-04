declare function commonRules(turndownService: any): Promise<void>;
declare function feedRules(turndownService: any, feedUrl: string): Promise<void>;
export { commonRules, feedRules };
