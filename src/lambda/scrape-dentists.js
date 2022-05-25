const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: true,
    });

    const page = await browser.newPage();

    // await page.setBypassCSP(true)
    const postcode = event.queryStringParameters.postcode
    const lat = event.queryStringParameters.lat
    const lng = event.queryStringParameters.lng

    await page.goto(`https://www.nhs.uk/service-search/other-services/Dentists/${postcode}/Results/12/${lng}/${lat}/3/0?distance=50&ResultsOnPageValue=50&isNational=0`);

    const dentistNames = await page.$$eval('tr th.fctitle', (dentists) => {
        return dentists.map(dentist => dentist.innerText);
    });

    const dentistLinks = await page.$$eval('tr th.fctitle a', (dentists) => {
        return dentists.map(dentist => 'https://www.nhs.uk' + dentist.getAttribute('href'));
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
            link: dentistLinks[index],
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