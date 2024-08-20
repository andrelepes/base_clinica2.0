const handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateToPDF(pathToTemplate, data) {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, '..', 'views', `${pathToTemplate}`),
      {
        encoding: 'utf-8',
      }
    );

    const template = handlebars.compile(html);

    const renderedTemplate = template(data);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(renderedTemplate);

    const pdf = await page.pdf({
      format: 'A4',
    });

    await browser.close();

    fs.writeFileSync(
      path.join(__dirname, '..', '..', 'downloads', `evolution.pdf`),
      pdf
    );

    return path.join(__dirname, '..', '..', 'downloads', `evolution.pdf`);
  } catch (error) {
    throw error;
  }
}

module.exports = { generateToPDF };
