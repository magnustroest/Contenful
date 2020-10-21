
const contentful = require('contentful-management');
const fetch = require('node-fetch')
//var segmentsNoDup = new Set(segments.join().split(";").join(",").split(","));

const API_ENDPOINT = "https://mt-t-eun-ipaas-apim.azure-api.net/imos-reporting/v2/GetWebFleet";

const fetchData = async () => {
    try {
        const response = await fetch(API_ENDPOINT, { headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': 'a9dd4c1c1eb3469b8f7c8f734a92bc7f' } });
        const responseJSON = await response.json();
        delete responseJSON.FleetTotalsSplitBySegment

        var segments = (responseJSON.FleetCollection.map(a => a.Type));
        var segmentsNoDup = new Set(segments.join().split(";").join(",").split(","));
        addShipData(segmentsNoDup);
    }
    catch (e) {

    }
}

const client = contentful.createClient({
    accessToken: 'CFPAT-rBFuWL3oYIA-xsTKkrMLlp4BawH2jATLtfGjs9nB-fQ',
});

const addShipData = async (segmentsNoDup) => {
    try {
        console.log(segmentsNoDup)
        const clientWithSpace = await client.getSpace('bo1ey0o7gnnb');
        const clientWithEnv = await clientWithSpace.getEnvironment('master');

        writeData()
        async function writeData (){
            for(const data of segmentsNoDup){
                console.log(data)
                const segments = await clientWithEnv.createEntry('shipSegment', {
                    fields: {
                        type: { 'en-US': data }
                    }
                })
                segments.publish()
            }

        }
    } catch (e) {
        console.error(e)
    }
}
fetchData();
