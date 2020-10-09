var JSONStream = require('JSONStream')
var es = require("event-stream");
const fs = require('fs');
const contentful = require('contentful-management');

const client = contentful.createClient({
    accessToken: 'CFPAT-0OlCsvgV0ZMW6kdFRxE1StUSi7bEN4MxQPPWf9clovk',
});
async function main() {
    fileStream = fs.createReadStream("./people.JSON", { encoding: "utf8" });
    fileStream.pipe(JSONStream.parse("People.*")).pipe(
        es.through(function (data) {
            this.pause();
            processOneEntry(data, this);
            return data;
        }),
        function end() {
            console.log("stream reading ended");
            this.emit("end");
        }
    );
    
}
async function processOneEntry(data, es) {
    await client.getSpace('q8pwc6wr0xmf')
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.createEntry('people', {
        fields: {
            firstName: { 'en-US': data['first-name'] },
            lastName: { 'en-US': data['last-name'] },
            phone: { 'en-US': data.phone },
            location: { 'en-US': data.location },
            divisionId: { 'en-US': data['division-id'] },
            divisionName: { 'en-US': data['division-name'] },
            positionName: { 'en-US': data['position-name'] },
            email: { 'en-US': data.email },
            iceId: { 'en-US': data['ice-id'] },
            segments: { 'en-US': data.segments }
        }
    }))
    .then((entry) => entry.publish())
    .catch(console.error)
    es.resume();
}
main();