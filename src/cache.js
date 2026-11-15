// we need location to save news--news is independent of any system
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';

const CACHE_DIR = path.join(os.homedir(), '.news-cli');
console.log("**** HOME DIR **** ", os.homedir());
function getFileForCategory(category){
    return path.join(CACHE_DIR, `${category}.json`);
}
export async function saveNews(category, articles){ //serialization
    await fs.mkdir(CACHE_DIR, {recursive:true}); // if folder is not there then create it
    const obj = {articles, savedAt : new Date().toLocaleString()};
    await fs.writeFile(getFileForCategory(category), JSON.stringify(obj));
}

export async function loadNews(category){ //deserialization
    try {
        const jsonString = await fs.readFile(getFileForCategory(category), 'utf-8');
        return JSON.parse(jsonString);
    } catch (err) {
        return null;
    }
}