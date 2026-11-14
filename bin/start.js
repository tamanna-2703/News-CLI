#!/usr/bin/env node 
import { Command } from 'commander';
import { getNews } from '../src/news-fetcher.js';
import chalk from 'chalk';
import { showBanner } from '../src/banner.js';

// console.log("Hello News CLI ... ");
showBanner('NEWS CLI');
// console.log(process.argv);

const program = new Command();

program
  .name("news-cli")
  .description("This is my own CLI tool - powered by Tamannaah")
  .version("1.0.0")
  .option("--sportsnews", "Show Sports News")
  .option("--businessnews", "Show Business News")
  .option("--technews", "Show Tech News")
  .option("-l --limit <number>", "How Many Limit of News to Show", '5')
  .option("--offline", "Run Without Internet")
  .parse();

const obj = program.opts();
console.log(obj);

const categories = [];
if (obj.sportsnews) {
  categories.push('sports');
}
if (obj.businessnews) {
  categories.push('business');
}
if (obj.technews) {
  categories.push('tech');
}

if (categories.length == 0) {
  console.log('Pick at least one category sportsnews businessnews technews');
  program.help({ error: true });
}
console.log(categories);

// --- Formatted News Output ---
function printNews(category, result) {
  console.log('\n' + chalk.bgMagenta.white.bold(` === ${category.toUpperCase()} NEWS === `) + '\n');

  result.articles.forEach((article, index) => {
    const d = article.date ? new Date(article.date).toLocaleString() : 'Unknown Date';

    console.log(chalk.yellow.bold(`[#${index + 1}] `) + chalk.bold.white(article.title));
    console.log(chalk.red(`Date: ${d}`));
    console.log(chalk.blue(`Summary: ${article.summary}`));
    if (article.link) {
      console.log(chalk.gray(`Link: ${article.link}`));
    }
    console.log(chalk.dim('------------------------------------------------------------\n'));
  });
}

const limit = Number(obj.limit);

// Call Category by Category RSS FEED
for (let category of categories) {
  const result = await getNews(category, limit);
  printNews(category, result);
}