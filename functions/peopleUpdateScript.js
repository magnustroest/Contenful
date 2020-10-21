const fetch = require('node-fetch')
require('dotenv').config();
const Post_API = process.env.Post_API;
const contentful = require('contentful-management');

exports.handler = async function (event, context) {
const client = contentful.createClient({
    accessToken: process.env.accessToken,
});
const sleep = require('util').promisify(setTimeout)
const main = async () => {
    try {
        const postResponse = await fetch(Post_API, {
            headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': process.env.OcpApimSubscriptionKeyPeople, 'Access-Control-Expose-Headers': 'Location' },
            method: "POST",
            body: JSON.stringify({
                "exclude-positions": ["A1 Student Assistant", "Intern"],
                "override-position-names": [
                    {
                        "original": "Charterer, MR",
                        "replacement": "Charterer"
                    },
                    {
                        "original": "Senior Charterer, MR",
                        "replacement": "Senior Charterer"
                    },
                    {
                        "original": "Senior Charterer, LR2",
                        "replacement": "Senior Charterer"
                    },
                    {
                        "original": "Operator, Intermediate",
                        "replacement": "Operator"
                    }
                ],
                "divisions": [
                    {
                        "id": "COMM",
                        "use-ice": "False",
                        "name": "Communications",
                        "segments": ""
                    },
                    {
                        "id": "CITYOPS",
                        "use-ice": "True",
                        "name": "Operations",
                        "segments": "City"
                    },
                    {
                        "id": "HANDYOPSMUM",
                        "use-ice": "True",
                        "name": "Operations",
                        "segments": "Handy"
                    },
                    {
                        "id": "INTOPSCPH",
                        "use-ice": "True",
                        "name": "Operations",
                        "segments": "Intermediate"
                    },
                    {
                        "id": "MROPSMUM",
                        "use-ice": "True",
                        "name": "Operations",
                        "segments": "MR"
                    },
                    {
                        "id": "MTOPSMUM",
                        "use-ice": "True",
                        "name": "Operations",
                        "segments": "Handy"
                    },
                    {
                        "id": "CITYCHART",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "City"
                    },
                    {
                        "id": "SEASIA",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "LR2"
                    },
                    {
                        "id": "FLEXIOPS",
                        "use-ice": "True",
                        "name": "Operations",
                        "segments": "Flexi"
                    },
                    {
                        "id": "FREIGHTOPT",
                        "use-ice": "True",
                        "name": "Freight Optimisation",
                        "segments": ""
                    },
                    {
                        "id": "HTC",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "Handy"
                    },
                    {
                        "id": "BROCHART",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "Intermediate"
                    },
                    {
                        "id": "LR2CHART",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "LR2"
                    },
                    {
                        "id": "MR",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "MR"
                    },
                    {
                        "id": "OPS",
                        "use-ice": "True",
                        "name": "Operations",
                        "segments": ""
                    },
                    {
                        "id": "PARREL",
                        "use-ice": "True",
                        "name": "Partner Relations",
                        "segments": ""
                    },
                    {
                        "id": "PARSERV",
                        "use-ice": "True",
                        "name": "Partner Services",
                        "segments": ""
                    },
                    {
                        "id": "STRAPAR",
                        "use-ice": "True",
                        "name": "Commercial",
                        "segments": ""
                    },
                    {
                        "id": "CHTCPH",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "Handy"
                    },
                    {
                        "id": "CHTSIN",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "Handy"
                    },
                    {
                        "id": "MRSIN",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "MR"
                    },
                    {
                        "id": "MRCHARTUS",
                        "use-ice": "True",
                        "name": "Chartering",
                        "segments": "MR;Handy;Intermediate"
                    }
                ]
            })

        });

        async function getResponseMethod() {
            var getResponse = await fetch(postResponse.headers.get('Location'), {
                headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': '9f8b74dceb90488e8013731d72d86cf2', 'Access-Control-Expose-Headers': 'Location' },
                method: "GET",
            });
            var json = await getResponse.json()
            if (typeof json.properties !== 'undefined') {
                console.log("waiting 10 sec")
                await sleep(10000)
                return getResponseMethod();
            }
            else {
                return json
            }
        }

        var json = await getResponseMethod()

        const clientWithSpace = await client.getSpace(process.env.getSpace);
        const clientWithEnv = await clientWithSpace.getEnvironment('master');


        var people = await clientWithEnv.getEntries({
            content_type: 'people',
            limit: 500
        }
        );
        var peopleFields = people.items.map(a => a.fields)

        var peopleSegments = await clientWithEnv.getEntries({
            content_type: 'peopleSegments'
        }
        );
        var peoplePositionName = await clientWithEnv.getEntries({
            content_type: 'peoplePositionName'
        }
        );
        var peopleLocation = await clientWithEnv.getEntries({
            content_type: 'peopleLocation'
        }
        );
       
        var peoplePositionNameFields = peoplePositionName.items.map(a => a.fields)
        var peopleLocationFields = peopleLocation.items.map(a => a.fields)

        function findPositionNameByReference(id) {
            var positionName;
            peoplePositionName.items.forEach((element) => {
                if (element.sys.id === id) {
                    positionName = Object.values(element.fields.positionName).toString()
                }
            });
            return positionName;
        }
        function findLocationByReference(id) {
            var location;
            peopleLocation.items.forEach((element) => {
                if (element.sys.id === id) {
                    location = Object.values(element.fields.location).toString()
                }
            });
            return location;
        }
        function findEntryIdByEmail(email) {
            var entryId;
            for (element of people.items) {
                if (Object.values(element.fields.email).toString() === email) {
                    entryId = element.sys.id.toString()
                }

            }
            return entryId;
        }
        function findEntryIdByPositionName(positionName) {
            var entryId;
            for (element of peopleSegments.items) {
                if (Object.values(element.fields.peoplePositionName).toString() === positionName) {
                    entryId = element.sys.id.toString()
                }

            }
            return entryId;
        }

        function findEntryIdByLocation(location) {
            var entryId;
            for (element of peopleLocation.items) {
                if (Object.values(element.fields.peopleLocation).toString() === location) {
                    entryId = element.sys.id.toString()
                }

            }
            return entryId;
        }

        const positionNameDoNotExistsOrIsUpdated = peoplePositionNameFields.filter(item => json.every(item2 => item2["position-name"] != Object.values(item.positionName).toString()
        ));

        const locationDoNotExistsOrIsUpdated = peopleLocationFields.filter(item => json.every(item2 => item2.location != Object.values(item.location).toString()
        ));

        console.log(positionNameDoNotExistsOrIsUpdated)
        console.log(locationDoNotExistsOrIsUpdated)

        //removes modified or deleted items
        for (item of positionNameDoNotExistsOrIsUpdated) {
            var positionName = Object.values(item.positionName).toString()
            id = findEntryIdByPositionName(positionName)
            console.log(id)
            const entry = await clientWithEnv.getEntry(id)
            const unpublishEntry = await entry.unpublish()
            const deleteEntry = await unpublishEntry.delete()
            console.log("Deleted " + deleteEntry)
        }
        peoplePositionName = await clientWithEnv.getEntries({
            content_type: 'peoplePositionName',
            limit: 500
        }
        );
        peoplePositionNameFields = peoplePositionName.items.map(a => a.fields)
        //Finds new added items
        const filteredPeoplePosition = json.filter(x => {
            const doesNotExist = peoplePositionNameFields.findIndex(y => {
                const peoplePositionName = Object.values(y.positionName)[0]
                const positionName = x["position-name"]
                return peoplePositionName === positionName
            }) === -1;
            return doesNotExist;
        })
        const filteredPeoplePositionNoDup = new Set(filteredPeoplePosition);

        //Looping through filtered items and add them to contentful
        for (const data of filteredPeoplePositionNoDup) {
            await processOneEntrySegment(data, this);
        }
        async function processOneEntrySegment(data) {
            await client.getSpace(process.env.getSpace)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('peopleSegments', {
                    fields: {
                        name: { 'en-US': data.positionName },
                    }
                }))
                .then((entry) => entry.publish())
                .catch(console.error)
        }


        //removes modified or deleted items
        for (item of locationDoNotExistsOrIsUpdated) {
            var location = Object.values(item.location).toString()
            id = findEntryIdByLocation(location)
            console.log(id)
            const entry = await clientWithEnv.getEntry(id)
            const unpublishEntry = await entry.unpublish()
            const deleteEntry = await unpublishEntry.delete()
            console.log("Deleted " + deleteEntry)
        }
        peopleLocation = await clientWithEnv.getEntries({
            content_type: 'peopleLocation',
            limit: 500
        }
        );
        peopleLocationFields = peopleLocation.items.map(a => a.fields)
        //Finds new added items
        const filteredPeopleLocation = json.filter(x => {
            const doesNotExist = peopleLocationFields.findIndex(y => {
                const peopleLocation = Object.values(y.location)[0]
                const location = x.location
                return peopleLocation === location
            }) === -1;
            return doesNotExist;
        })
        const filteredPeopleLocationNoDup = new Set(filteredPeopleLocation);

        //Looping through filtered items and add them to contentful
        for (const data of filteredPeopleLocationNoDup) {
            await processOneEntryLocation(data, this);
        }
        async function processOneEntryLocation(data) {
            await client.getSpace(process.env.getSpace)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('peopleLocation', {
                    fields: {
                        name: { 'en-US': data.location },
                    }
                }))
                .then((entry) => entry.publish())
                .catch(console.error)
        }
        //Finds modified or deleted items
        doNotExistsOrIsUpdated = peopleFields.filter(item =>
            json.every(item2 =>
                item2["first-name"] != Object.values(item.firstName).toString()
                || item2["last-name"] != Object.values(item.lastName).toString()
                || ((item2.phone || "") != Object.values(item.phone).toString())
                || item2.location != findLocationByReference(item.location['en-US'].sys.id.toString())
                || item2["division-id"] != Object.values(item.divisionId).toString()
                || item2["division-name"] != Object.values(item.divisionName).toString()
                || item2["position-name"] != findPositionNameByReference(item.positionName['en-US'].sys.id.toString())
                || item2.email != Object.values(item.email).toString()
                || item2["ice-id"] != Object.values(item.iceId).toString()
            ));
        console.log(doNotExistsOrIsUpdated)
        //removes modified or deleted items
        for (item of doNotExistsOrIsUpdated) {
            var email = Object.values(item.email).toString()
            id = findEntryIdByEmail(email)
            console.log(id)
            const entry = await clientWithEnv.getEntry(id)
            const unpublishEntry = await entry.unpublish()
            const deleteEntry = await unpublishEntry.delete()
            console.log("Deleted " + deleteEntry)
        }
        people = await clientWithEnv.getEntries({
            content_type: 'people',
            limit: 500
        }
        );
        peopleFields = people.items.map(a => a.fields)
        //Finds new added items
        const filtered = json.filter(x => {
            const doesNotExist = peopleFields.findIndex(y => {
                const peopleEmail = Object.values(y.email)[0]
                const newPeopleEmail = x.email
                return peopleEmail === newPeopleEmail
            }) === -1;
            return doesNotExist;
        })

        //Looping through filtered items and add them to contentful
        for (const data of filtered) {
            let segmentsId = [];
            let locationId;
            let positionNameId;
            peopleLocation.items.forEach((element) => {
                if (Object.values(element.fields.location).toString() === data.location) {
                    locationId = element.sys.id
                }
            });
            peoplePositionName.items.forEach((element) => {
                if (Object.values(element.fields.positionName).toString() === data["position-name"]) {
                    positionNameId = element.sys.id
                    console.log(positionNameId)
                }
            });
            peopleSegments.items.forEach((element) => {
                if (data.segments.includes(Object.values(element.fields.segments).toString())) {
                    segmentsId.push({ sys: { type: "Link", linkType: "Entry", id: element.sys.id } })
                }
                if (data.segments === "" && Object.values(element.fields.segments).toString() === "None") {
                    segmentsId.push({ sys: { type: "Link", linkType: "Entry", id: "5QMxLnwQanYSHtk27iLrlN" } })
                }
            });
            await processOneEntry(data, segmentsId, locationId, positionNameId, this);
        }
        async function processOneEntry(data, segmentsId, locationId, positionNameId) {
            await client.getSpace(process.env.getSpace)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('people', {
                    fields: {
                        firstName: { 'en-US': data['first-name'] },
                        lastName: { 'en-US': data['last-name'] },
                        phone: { 'en-US': data.phone },
                        location: { "en-US": { sys: { type: "Link", linkType: "Entry", id: locationId } } },
                        divisionId: { 'en-US': data['division-id'] },
                        divisionName: { 'en-US': data['division-name'] },
                        positionName: { "en-US": { sys: { type: "Link", linkType: "Entry", id: positionNameId } } },
                        email: { 'en-US': data.email },
                        iceId: { 'en-US': data['ice-id'] },
                        segments: { 'en-US': segmentsId },
                        fullName: { 'en-US': data['first-name'] + " " + data['last-name'] }
                    }
                }))
                .then((entry) => entry.publish())
                .catch(console.error)
        }
    } catch (e) {
        console.error(e)
    }
}
main();
}