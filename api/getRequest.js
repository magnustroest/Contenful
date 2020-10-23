import * as test from './peopleUpdateScript'
const fetch = require('node-fetch')
require('dotenv').config({path: '../.env'});
const contentful = require('contentful-management');
const client = contentful.createClient({
    accessToken: process.env.ACCESSTOKEN,
});
const sleep = require('util').promisify(setTimeout)
exports.handler = async function (event, context) {
    try {

        async function getResponseMethod() {
            var getResponse = await fetch(postResponse.headers.get('Location'), {
                headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': process.env.OCPAPIMSUBSCRIPTIONKEYPEOPLE, 'Access-Control-Expose-Headers': 'Location' },
                method: "GET",
            });
            var json = await getResponse.json()
            if (typeof json.properties !== 'undefined') {
                await sleep(5000)
                return getResponseMethod();
            }
            else {
                return json
            }
        }
       
    }
    catch (e) {
        console.log(e)
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Goood" })
    };
}
