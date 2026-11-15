#!/usr/bin/env node 
import { Command } from 'commander';
import { getNews } from '../src/news-fetcher.js';
import chalk from 'chalk';
import ora from 'ora';
import { select } from '@inquirer/prompts';
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
  .option("--worldnews", "Show World News")
  .option("--sciencenews", "Show Science & Environment News")
  .option("--entertainmentnews", "Show Entertainment & Arts News")
  .option("--ainews", "Show Artificial Intelligence News")
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
if (obj.worldnews) {
  categories.push('world');
}
if (obj.sciencenews) {
  categories.push('science');
}
if (obj.entertainmentnews) {
  categories.push('entertainment');
}
if (obj.ainews) {
  categories.push('ai');
}

// If no flags passed, launch the interactive menu (Enter to select)
if (categories.length == 0) {
  const chosen = await select({
    message: 'Select a news category to read (Press Enter to choose):',
    choices: [
      { name: '🤖 Artificial Intelligence', value: 'ai' },
      { name: '💻 Technology', value: 'tech' },
      { name: '⚽ Sports', value: 'sports' },
      { name: '📈 Business', value: 'business' },
      { name: '🌍 World News', value: 'world' },
      { name: '🔬 Science & Environment', value: 'science' },
      { name: '🎬 Entertainment & Arts', value: 'entertainment' }
    ]
  });

  categories.push(chosen);
}

var status = 'online';
if (obj.offline) {
  status = 'offline';
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

// Call Category by Category RSS FEED with Ora loading spinner
for (let category of categories) {
  const spinner = ora(`Fetching ${category.toUpperCase()} news...`).start();
  const result = await getNews(category, limit, status);
  spinner.succeed(`Loaded ${category.toUpperCase()} news!`);
  printNews(category, result);
}
