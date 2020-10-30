const fetch = require('node-fetch')
const contentful = require('contentful-management');
const client = contentful.createClient({
    accessToken: process.env.ACCESSTOKEN,
});
const postBody = require('./postbody.json')
const sleep = require('util').promisify(setTimeout)
exports.handler = async function (event, context) {
    try {
        const postResponse = await fetch(process.env.POST_API, {
            headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': process.env.OCPAPIMSUBSCRIPTIONKEYPEOPLE, 'Access-Control-Expose-Headers': 'Location' },
            method: "POST",
            body: JSON.stringify(postBody)

        });
        async function getResponseMethod() {
            var getResponse = await fetch(postResponse.headers.get('Location'), {
                headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': process.env.OCPAPIMSUBSCRIPTIONKEYPEOPLE, 'Access-Control-Expose-Headers': 'Location' },
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

        var apiResponseJson = await getResponseMethod()

        const clientWithSpace = await client.getSpace(process.env.SPACE_ID);
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
        var peopleDivision = await clientWithEnv.getEntries({
            content_type: 'peopleDivision'
        }
        );
        var peopleLocation = await clientWithEnv.getEntries({
            content_type: 'peopleLocation'
        }
        );

        var peopleDivisionFields = peopleDivision.items.map(a => a.fields)
        var peopleLocationFields = peopleLocation.items.map(a => a.fields)

        function findDivisionByReference(id) {
            var divisionName;
            peopleDivision.items.forEach((element) => {
                if (element.sys.id === id) {
                    divisionName = Object.values(element.fields.divisionName).toString()
                }
            });
            return divisionName;
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
        function findEntryIdByDivisionName(divisionName) {
            var entryId;
            for (element of peopleDivision.items) {
                if (Object.values(element.fields.divisionName).toString() === divisionName) {
                    entryId = element.sys.id.toString()
                }

            }
            return entryId;
        }

        function findEntryIdByLocation(location) {
            var entryId;
            for (element of peopleLocation.items) {
                if (Object.values(element.fields.location).toString() === location) {
                    entryId = element.sys.id.toString()
                }

            }
            return entryId;
        }

        const divisionNameDoNotExistsOrIsUpdated = peopleDivisionFields.filter(item => apiResponseJson.every(item2 => item2["division-name"] != Object.values(item.divisionName).toString()
        ));

        const locationDoNotExistsOrIsUpdated = peopleLocationFields.filter(item => apiResponseJson.every(item2 => item2.location != Object.values(item.location).toString()
        ));
        //removes modified or deleted items
        if (divisionNameDoNotExistsOrIsUpdated.length !== 0) {
            for (item of divisionNameDoNotExistsOrIsUpdated) {
                var divisionName = Object.values(item.divisionName).toString()
                id = findEntryIdByDivisionName(divisionName)
                console.log(id)
                const entry = await clientWithEnv.getEntry(id)
                const unpublishEntry = await entry.unpublish()
                const deleteEntry = await unpublishEntry.delete()
                console.log("Deleted " + deleteEntry)
            }
        }
        peopleDivision = await clientWithEnv.getEntries({
            content_type: 'peopleDivision',
            limit: 500
        }
        );
        peopleDivisionFields = peopleDivision.items.map(a => a.fields)
        //Finds new added items
        const filteredDivision = apiResponseJson.filter(x => {
            const doesNotExist = peopleDivisionFields.findIndex(y => {
                const peopleDivisionName = Object.values(y.divisionName)[0]
                const divisionName = x["division-name"]
                return peopleDivisionName === divisionName
            }) === -1;
            return doesNotExist;
        })
        const divisionArray = []
        for(const item of filteredDivision){
            divisionArray.push(item["division-name"])
        }
        const divisionArrayNoDup = [...new Set(divisionArray)];

        //Looping through filtered items and add them to contentful
        if (divisionArrayNoDup.length !== 0) {
            for (const data of divisionArrayNoDup) {
                await processOneEntrySegment(data, this);
            }
        }
        async function processOneEntrySegment(data) {
            await client.getSpace(process.env.SPACE_ID)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('peopleDivision', {
                    fields: {
                        divisionName: { 'en-US': data },
                    }
                }))
                .then((entry) => entry.publish())
                .catch(console.error)
        }
        //removes modified or deleted items
        if (locationDoNotExistsOrIsUpdated.length !== 0) {
            for (item of locationDoNotExistsOrIsUpdated) {
                var location = Object.values(item.location).toString()
                id = findEntryIdByLocation(location)
                console.log(id)
                const entry = await clientWithEnv.getEntry(id)
                const unpublishEntry = await entry.unpublish()
                const deleteEntry = await unpublishEntry.delete()
                console.log("Deleted " + deleteEntry)
            }
        }
        peopleLocation = await clientWithEnv.getEntries({
            content_type: 'peopleLocation',
            limit: 500
        }
        );
        peopleLocationFields = peopleLocation.items.map(a => a.fields)
        //Finds new added items
        const filteredPeopleLocation = apiResponseJson.filter(x => {
            const doesNotExist = peopleLocationFields.findIndex(y => {
                const peopleLocation = Object.values(y.location)[0]
                const location = x.location
                return peopleLocation === location
            }) === -1;
            return doesNotExist;
        })
        const locationArray = []
        for(const item of filteredPeopleLocation){
            locationArray.push(item.location)
        }
        const locationArrayNoDup = [...new Set(locationArray)];

        //Looping through filtered items and add them to contentful
        if (locationArrayNoDup.length !== 0) {
            for (const data of locationArrayNoDup) {
                await processOneEntryLocation(data, this);
            }
        }
        async function processOneEntryLocation(data) {
            await client.getSpace(process.env.SPACE_ID)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('peopleLocation', {
                    fields: {
                        location: { 'en-US': data },
                    }
                }))
                .then((entry) => entry.publish())
                .catch(console.error)
        }
        //Finds modified or deleted items
        doNotExistsOrIsUpdated = peopleFields.filter(item =>
            apiResponseJson.every(item2 =>
                item2["first-name"] != Object.values(item.firstName).toString()
                || item2["last-name"] != Object.values(item.lastName).toString()
                || ((item2.phone || "") != Object.values(item.phone).toString())
                || item2.location != findLocationByReference(item.location['en-US'].sys.id.toString())
                || item2["division-id"] != Object.values(item.divisionId).toString()
                || item2["division-name"] != findDivisionByReference(item.divisionName['en-US'].sys.id.toString())
                || item2["position-name"] != Object.values(item.positionName).toString()
                || item2.email != Object.values(item.email).toString()
                || item2["ice-id"] != Object.values(item.iceId).toString()
            ));
        console.log(doNotExistsOrIsUpdated)
        //removes modified or deleted items
        if (doNotExistsOrIsUpdated.length !== 0) {
            for (item of doNotExistsOrIsUpdated) {
                var email = Object.values(item.email).toString()
                id = findEntryIdByEmail(email)
                console.log(id)
                const entry = await clientWithEnv.getEntry(id)
                const unpublishEntry = await entry.unpublish()
                const deleteEntry = await unpublishEntry.delete()
                console.log("Deleted " + deleteEntry)
            }
        }
        people = await clientWithEnv.getEntries({
            content_type: 'people',
            limit: 500
        }
        );
        peopleFields = people.items.map(a => a.fields)
        //Finds new added items
        const filtered = apiResponseJson.filter(x => {
            const doesNotExist = peopleFields.findIndex(y => {
                const peopleEmail = Object.values(y.email)[0]
                const newPeopleEmail = x.email
                return peopleEmail === newPeopleEmail
            }) === -1;
            return doesNotExist;
        })

        //Looping through filtered items and add them to contentful
        if (filtered.length !== 0) {
            for (const data of filtered) {
                let segmentsId = [];
                let locationId;
                let divisionNameId;
                peopleLocation.items.forEach((element) => {
                    if (Object.values(element.fields.location).toString() === data.location) {
                        locationId = element.sys.id
                    }
                });
                peopleDivision.items.forEach((element) => {
                    if (Object.values(element.fields.divisionName).toString() === data["division-name"]) {
                        divisionNameId = element.sys.id
                        console.log(divisionNameId)
                    }
                });
                peopleSegments.items.forEach((element) => {
                    if (data.segments.includes(Object.values(element.fields.segments).toString())) {
                        segmentsId.push({ sys: { type: "Link", linkType: "Entry", id: element.sys.id } })
                    }
                });
                await processOneEntry(data, segmentsId, locationId, divisionNameId, this);
            }
        }
        async function processOneEntry(data, segmentsId, locationId, divisionNameId) {
            await client.getSpace(process.env.SPACE_ID)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('people', {
                    fields: {
                        firstName: { 'en-US': data['first-name'] },
                        lastName: { 'en-US': data['last-name'] },
                        phone: { 'en-US': data.phone },
                        location: { "en-US": { sys: { type: "Link", linkType: "Entry", id: locationId } } },
                        divisionId: { 'en-US': data['division-id'] },
                        divisionName: { "en-US": { sys: { type: "Link", linkType: "Entry", id: divisionNameId} } },
                        positionName: { 'en-US': data['position-name'] },
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
        return {
            statusCode: 500,
            body: JSON.stringify({ message: e })
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Everything went well" })
    };
}