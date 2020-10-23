// import * as test from './getRequest'
// const fetch = require('node-fetch')
// require('dotenv').config({ path: '../.env' });
// const contentful = require('contentful-management');
// const client = contentful.createClient({
//     accessToken: process.env.ACCESSTOKEN,
// });
// const sleep = require('util').promisify(setTimeout)
// exports.handler = async function (event, context) {
//     try {
//         console.log("her er jeg")
//         const postResponse = await fetch(process.env.POST_API, {
//             headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': process.env.OCPAPIMSUBSCRIPTIONKEYPEOPLE, 'Access-Control-Expose-Headers': 'Location' },
//             method: "POST",
//             body: JSON.stringify({
//                 "exclude-positions": ["A1 Student Assistant", "Intern"],
//                 "override-position-names": [
//                     {
//                         "original": "Charterer, MR",
//                         "replacement": "Charterer"
//                     },
//                     {
//                         "original": "Senior Charterer, MR",
//                         "replacement": "Senior Charterer"
//                     },
//                     {
//                         "original": "Senior Charterer, LR2",
//                         "replacement": "Senior Charterer"
//                     },
//                     {
//                         "original": "Operator, Intermediate",
//                         "replacement": "Operator"
//                     }
//                 ],
//                 "divisions": [
//                     {
//                         "id": "COMM",
//                         "use-ice": "False",
//                         "name": "Communications",
//                         "segments": ""
//                     },
//                     {
//                         "id": "CITYOPS",
//                         "use-ice": "True",
//                         "name": "Operations",
//                         "segments": "City"
//                     },
//                     {
//                         "id": "HANDYOPSMUM",
//                         "use-ice": "True",
//                         "name": "Operations",
//                         "segments": "Handy"
//                     },
//                     {
//                         "id": "INTOPSCPH",
//                         "use-ice": "True",
//                         "name": "Operations",
//                         "segments": "Intermediate"
//                     },
//                     {
//                         "id": "MROPSMUM",
//                         "use-ice": "True",
//                         "name": "Operations",
//                         "segments": "MR"
//                     },
//                     {
//                         "id": "MTOPSMUM",
//                         "use-ice": "True",
//                         "name": "Operations",
//                         "segments": "Handy"
//                     },
//                     {
//                         "id": "CITYCHART",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "City"
//                     },
//                     {
//                         "id": "SEASIA",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "LR2"
//                     },
//                     {
//                         "id": "FLEXIOPS",
//                         "use-ice": "True",
//                         "name": "Operations",
//                         "segments": "Flexi"
//                     },
//                     {
//                         "id": "FREIGHTOPT",
//                         "use-ice": "True",
//                         "name": "Freight Optimisation",
//                         "segments": ""
//                     },
//                     {
//                         "id": "HTC",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "Handy"
//                     },
//                     {
//                         "id": "BROCHART",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "Intermediate"
//                     },
//                     {
//                         "id": "LR2CHART",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "LR2"
//                     },
//                     {
//                         "id": "MR",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "MR"
//                     },
//                     {
//                         "id": "OPS",
//                         "use-ice": "True",
//                         "name": "Operations",
//                         "segments": ""
//                     },
//                     {
//                         "id": "PARREL",
//                         "use-ice": "True",
//                         "name": "Partner Relations",
//                         "segments": ""
//                     },
//                     {
//                         "id": "PARSERV",
//                         "use-ice": "True",
//                         "name": "Partner Services",
//                         "segments": ""
//                     },
//                     {
//                         "id": "STRAPAR",
//                         "use-ice": "True",
//                         "name": "Commercial",
//                         "segments": ""
//                     },
//                     {
//                         "id": "CHTCPH",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "Handy"
//                     },
//                     {
//                         "id": "CHTSIN",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "Handy"
//                     },
//                     {
//                         "id": "MRSIN",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "MR"
//                     },
//                     {
//                         "id": "MRCHARTUS",
//                         "use-ice": "True",
//                         "name": "Chartering",
//                         "segments": "MR;Handy;Intermediate"
//                     }
//                 ]
//             })

//         });

//         await sleep(5000)

//         var json = test.


//     }
//     catch (e) {
//         console.log(e)
//     }
//     return {
//         statusCode: 200,
//         body: JSON.stringify({ message: "Goood" })
//     };
// }
