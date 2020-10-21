const fetch = require('node-fetch')


const Post_API = "https://mt-t-eun-ipaas-apim.azure-api.net/mt-website/PeopleAsyn";
const contentful = require('contentful-management');
const { get } = require('lodash');
const client = contentful.createClient({
    accessToken: 'CFPAT-0OlCsvgV0ZMW6kdFRxE1StUSi7bEN4MxQPPWf9clovk',
});
require('dotenv').config();

const test = async () => {
    try {

        console.log(process.env);
    } catch (e) {
        console.error(e)
    }

}
test();