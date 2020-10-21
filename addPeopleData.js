
const contentful = require('contentful-management');

const client = contentful.createClient({
    accessToken: 'CFPAT-rBFuWL3oYIA-xsTKkrMLlp4BawH2jATLtfGjs9nB-fQ',
});

const fetch = require('node-fetch')
const API_ENDPOINT = "https://mt-t-eun-ipaas-apim.azure-api.net/mt-website/runs/08585987716348360273734072360CU14/operations/559ef517-c990-4730-9b4e-0351956e5792?api-version=2016-06-01&sp=%2Fruns%2F08585987716348360273734072360CU14%2Foperations%2F559ef517-c990-4730-9b4e-0351956e5792%2Fread&sv=1.0&sig=oESsDS3q9Wbd0xzD18VI63gdfCSaddBBj5jtXD5Kc-w";

const addPeopleData = async () => {
    try {

        const response = await fetch(API_ENDPOINT, {
            headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': '9f8b74dceb90488e8013731d72d86cf2' },
            method: "GET"

        });
        const json = await response.json();

        var positionName = (json.map(a => a['position-name']));
        var positionNameNoDup = new Set(positionName);
        var segments = (json.map(a => a.segments));
        var segmentsNoDup = new Set(segments.join().split(";").join(",").split(","));

        var locations = (json.map(a => a.location));
        var locationsNoDup = new Set(locations.join().split(";").join(",").split(","));
        const clientWithSpace = await client.getSpace('bo1ey0o7gnnb');
        const clientWithEnv = await clientWithSpace.getEnvironment('master');

        writeData()
        async function writeData() {

            for (const data of segmentsNoDup) {
                console.log(data)

                const segments = await clientWithEnv.createEntry('peopleSegments', {
                    fields: {
                        segments: { 'en-US': data }
                    }
                })
                segments.publish()
            }

            for (const data of locationsNoDup) {
                console.log(data)
                const locations = await clientWithEnv.createEntry('peopleLocation', {
                    fields: {
                        location: { 'en-US': data }
                    }
                })
                locations.publish()
            }

            for (const data of positionNameNoDup) {
                console.log(data)
                const positions = await clientWithEnv.createEntry('peoplePositionName', {
                    fields: {
                        positionName: { 'en-US': data }
                    }
                })
                positions.publish()
            }
        }
    } catch (e) {
        console.error(e)
    }
}
addPeopleData();
