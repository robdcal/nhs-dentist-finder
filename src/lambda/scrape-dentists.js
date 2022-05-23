const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: true,
    });

    const page = await browser.newPage();

    await page.setBypassCSP(true)
    await page.goto('https://www.nhs.uk/service-search/other-services/Dentists/cw6-0tp/Results/12/-2.66510772705078/53.1611061096191/3/0?distance=25&ResultsOnPageValue=100&isNational=0');

    const dentistNames = await page.$$eval('tr th.fctitle', (dentists) => {
        return dentists.map(dentist => dentist.innerText);
    });

    const dentistDistance = await page.$$eval('tr td div p.fcdirections', (dentists) => {
        return dentists.map(dentist => dentist.innerText);
    });

    const dentistAvailability = await page.$$eval('td[headers*="acceptingnewadultnhspatients"] img', (dentists) => {
        return dentists.map(dentist => dentist.getAttribute('alt'));
    });

    const dentistsList = await dentistNames.map((dentist, index) => {
        return {
            name: dentist,
            distance: dentistDistance[index],
            availability: dentistAvailability[index],
        }
    })

    await browser.close();

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
            status: 'Ok',
            dentistsList
        })
    };
}