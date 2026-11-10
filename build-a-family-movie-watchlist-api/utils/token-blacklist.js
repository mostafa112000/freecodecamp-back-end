const blacklist = new Set();

export function isBlacklisted(token){
    return blacklist.has(token);
}

export function blacklistToken(token){
    blacklist.add(token);
}