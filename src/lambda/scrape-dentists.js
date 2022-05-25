const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {
    const browser = await puppeteer.launch({
        // args: chromium.args,
        args: ['--single-process', '--no-zygote', '--no-sandbox'],
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: true,
    });

    let dentistsList = []
    let more = false

    try {
        const page = await browser.newPage();

        // await page.setBypassCSP(true)
        const postcode = event.queryStringParameters.postcode
        const lat = event.queryStringParameters.lat
        const lng = event.queryStringParameters.lng
        const pageNum = event.queryStringParameters.pageNum

        await page.goto(`https://www.nhs.uk/service-search/other-services/Dentists/${postcode}/Results/12/${lng}/${lat}/3/0?distance=50&ResultsOnPageValue=50&isNational=0&currentPage=${pageNum}`);

        const dentistNames = await page.$$eval('tr th.fctitle', (dentists) => {
            return dentists.map(dentist => dentist.innerText);
        });

        const dentistLinks = await page.$$eval('tr th.fctitle a', (dentists) => {
            return dentists.map(dentist => 'https://www.nhs.uk' + dentist.getAttribute('href'));
        });

        const dentistDistance = await page.$$eval('tr td div p.fcdirections', (dentists) => {
            return dentists.map(dentist => dentist.innerText);
        });

        const dentistAddress = await page.$$eval('tr td .fcdetailsleft .fcaddress', (dentists) => {
            return dentists.map(dentist => dentist.innerText.replace(/\n/g, ', '));
        });

        const dentistTel = await page.$$eval('tr td .fcdetailsleft .fctel', (dentists) => {
            return dentists.map(dentist => dentist.innerText.replace('Tel: ', ''));
        });

        const dentistAvailability = await page.$$eval('td[headers*="acceptingnewadultnhspatients"] img', (dentists) => {
            return dentists.map(dentist => dentist.getAttribute('alt'));
        });

        dentistsList = await dentistNames.map((dentist, index) => {
            return {
                name: dentist,
                link: dentistLinks[index],
                distance: dentistDistance[index],
                address: dentistAddress[index],
                tel: dentistTel[index],
                availability: dentistAvailability[index],
            }
        })

        more = await page.$$eval('#btn_searchresults_next', (moreBtn) => {
            return (moreBtn === undefined || moreBtn.length == 0) ? false : true
        });

        await browser.close();

    } catch (error) {

        await browser.close();

    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
            status: 'Ok',
            more: more,
            dentistsList,
        })
    };
}