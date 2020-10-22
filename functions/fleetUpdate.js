const fetch = require('node-fetch')
require('dotenv').config({path: '../.env'});
const contentful = require('contentful-management');

exports.handler = async function (event, context) {
    console.log("1")

    const client = contentful.createClient({
        accessToken: process.env.ACCESSTOKEN,
    });
    const main = async () => {
        try {
            console.log(API_ENDPOINT + " " + SPACE_ID)
            console.log("Oh")
            const clientWithSpace = await client.getSpace(process.env.SPACE_ID);
            console.log("MY")
            const clientWithEnv = await clientWithSpace.getEnvironment('master');
            console.log("God")
            const response = await fetch(process.env.API_ENDPOINT, { headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': process.env.OCPAPIMSUBSCRIPTIONKEYFLEET, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept' } });
            const json = await response.json();
            delete json.FleetTotalsSplitBySegment
            console.log("2")
            var vessel = await clientWithEnv.getEntries({
                content_type: 'vessel',
                limit: 500
            }
            );
            var ship = vessel.items.map(a => a.fields)

            var shipSegment = await clientWithEnv.getEntries({
                content_type: 'shipSegment'
            }
            );
            var shipSegmentFields = shipSegment.items.map(a => a.fields)

            function findTypeValueByReference(id) {
                var type;
                shipSegment.items.forEach((element) => {
                    if (element.sys.id === id) {
                        type = Object.values(element.fields.type).toString()
                    }
                });
                return type;
            }
            function findEntryIdByImoNumber(imoNumber) {
                var entryId;
                for (element of vessel.items) {
                    if (Object.values(element.fields.imoNumber).toString() === imoNumber) {
                        entryId = element.sys.id.toString()
                    }

                }
                return entryId;
            }
            function findEntryIdBySegmentName(segmentName) {
                var entryId;
                for (element of shipSegment.items) {
                    if (Object.values(element.fields.type).toString() === segmentName) {
                        entryId = element.sys.id.toString()
                    }

                }
                return entryId;
            }
            //Finds modified or deleted items

            const segmentDoNotExistsOrIsUpdated = shipSegmentFields.filter(item => json.FleetCollection.every(item2 => item2.Type != Object.values(item.type).toString()
            ));

            //removes modified or deleted items
            for (item of segmentDoNotExistsOrIsUpdated) {
                var segmentName = Object.values(item.type).toString()
                id = findEntryIdBySegmentName(segmentName)
                console.log(id)
                const entry = await clientWithEnv.getEntry(id)
                const unpublishEntry = await entry.unpublish()
                const deleteEntry = await unpublishEntry.delete()
                console.log("Deleted " + deleteEntry)
            }
            shipSegment = await clientWithEnv.getEntries({
                content_type: 'shipSegment',
                limit: 500
            }
            );
            shipSegmentFields = shipSegment.items.map(a => a.fields)
            //Finds new added items
            const filteredSegment = json.FleetCollection.filter(x => {
                const doesNotExist = shipSegmentFields.findIndex(y => {
                    const shipSegment = Object.values(y.type)[0]
                    const vesselSegment = x.Type
                    return shipSegment === vesselSegment
                }) === -1;
                return doesNotExist;
            })

            //Looping through filtered items and add them to contentful
            for (const data of filteredSegment) {
                await processOneEntrySegment(data, this);
            }
            async function processOneEntrySegment(data) {
                await client.getSpace(process.env.SPACE_ID)
                    .then((space) => space.getEnvironment('master'))
                    .then((environment) => environment.createEntry('shipSegment', {
                        fields: {
                            name: { 'en-US': data.type },
                        }
                    }))
                    .then((entry) => entry.publish())
                    .catch(console.error)
            }

            //Finds modified or deleted items
            doNotExistsOrIsUpdated = ship.filter(item => json.FleetCollection.every(item2 => item2.Name != Object.values(item.name).toString()
                || item2.Type != findTypeValueByReference(item.type['en-US'].sys.id.toString())
                || item2.Cbm != Object.values(item.cbm).toString()
                || item2.Sdwt != Object.values(item.sdwt).toString()
                || item2["Flag_Country_Name"] != Object.values(item.flagCountryName).toString()
                || item2["Build_Year"] != Object.values(item.buildYear).toString()
                || item2.Imo != Object.values(item.imo).toString()
                || item2["Ice_Class"] != Object.values(item.iceClass).toString()
                || item2.Yard != Object.values(item.yard).toString()
                || ((item2["Tank_Coating"] || "") !== Object.values(item.tankCoating).toString())
                || item2["Imo_Number"] != Object.values(item.imoNumber).toString()
                || item2.Draft != Object.values(item.draft).toString()
                || item2.Loa != Object.values(item.loa).toString()
                || item2.Beam != Object.values(item.beam).toString()
                || item2.Scnt != Object.values(item.scnt).toString()
                || item2.Pcbt != Object.values(item.pcbt).toString()
                || item2["Cbm_Slops"] != Object.values(item.cbmSlops).toString()
                || item2.Class != Object.values(item.class).toString()
                || item2.Piclub != Object.values(item.piclub).toString()
                || item2.Ktm != Object.values(item.ktm).toString()
            ));

            //removes modified or deleted items
            for (item of doNotExistsOrIsUpdated) {
                var imoNumber = Object.values(item.imoNumber).toString()
                id = findEntryIdByImoNumber(imoNumber)
                console.log(id)
                const entry = await clientWithEnv.getEntry(id)
                const unpublishEntry = await entry.unpublish()
                const deleteEntry = await unpublishEntry.delete()
                console.log("Deleted " + deleteEntry)
            }
            vessel = await clientWithEnv.getEntries({
                content_type: 'vessel',
                limit: 500
            }
            );
            ship = vessel.items.map(a => a.fields)
            //Finds new added items
            const filtered = json.FleetCollection.filter(x => {
                const doesNotExist = ship.findIndex(y => {
                    const shipNumber = Object.values(y.imoNumber)[0]
                    const fleetNumber = x.Imo_Number
                    return shipNumber === fleetNumber
                }) === -1;
                return doesNotExist;
            })
            console.log("næsten færdig")

            //Looping through filtered items and add them to contentful
            for (const data of filtered) {
                let segmentId = [];
                shipSegment.items.forEach((element) => {
                    if (data.Type.includes(Object.values(element.fields.type).toString())) {
                        segmentId = element.sys.id
                    }
                });
                await processOneEntry(data, segmentId, this);
            }
            async function processOneEntry(data, segmentId) {
                await client.getSpace(process.env.SPACE_ID)
                    .then((space) => space.getEnvironment('master'))
                    .then((environment) => environment.createEntry('vessel', {
                        fields: {
                            type: { "en-US": { sys: { type: "Link", linkType: "Entry", id: segmentId } } },
                            name: { 'en-US': data.Name },
                            flagCountryName: { 'en-US': data['Flag_Country_Name'] },
                            buildYear: { 'en-US': data['Build_Year'] },
                            yard: { 'en-US': data.Yard },
                            tankCoating: { 'en-US': data["Tank_Coating"] },
                            iceClass: { 'en-US': data["Ice_Class"] },
                            imo: { 'en-US': data.Imo },
                            imoNumber: { 'en-US': data['Imo_Number'] },
                            draft: { 'en-US': data.Draft },
                            loa: { 'en-US': data.Loa },
                            beam: { 'en-US': data.Beam },
                            scnt: { 'en-US': data.Scnt },
                            pcbt: { 'en-US': data.Pcbt },
                            cbm: { 'en-US': data.Cbm },
                            cbmSlops: { 'en-US': data["Cbm_Slops"] },
                            sdwt: { 'en-US': data.Sdwt },
                            class: { 'en-US': data.Class },
                            piclub: { 'en-US': data.Piclub },
                            ktm: { 'en-US': data.Ktm },

                        }
                    }))
                    .then((entry) => entry.publish())
                    .catch(console.error)
            }
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Goood" })
            };
        } catch (e) {
            console.error(e)
        }
    }
    main();
}