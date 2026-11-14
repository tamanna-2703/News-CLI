import cfonts from 'cfonts';
import chalk from 'chalk';

export function showBanner(title) {
  cfonts.say(title, {
    font: 'block',
    colors: ['red', 'blue']
  });
  console.log(chalk.greenBright.bold('Powered by Tamannaah'));
}