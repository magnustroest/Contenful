

const contentful = require('contentful-management');
const client = contentful.createClient({
    accessToken: 'CFPAT-rBFuWL3oYIA-xsTKkrMLlp4BawH2jATLtfGjs9nB-fQ',
});
async function test() {
    try {

        const clientWithSpace = await client.getSpace('bo1ey0o7gnnb');
        const clientWithEnv = await clientWithSpace.getEnvironment('master');
        const findEntry = await clientWithEnv.getEntries({
            content_type: 'people',
            limit: 500
        }
        );


        //delete method
        for (item of findEntry.items) {
            const unpublishEntry = await item.unpublish()
            const deleteEntry = await unpublishEntry.delete()
            console.log("Deleted " + deleteEntry)

        }
        //console.log(findEntry)
    } catch (e) {
        console.error(e)
    }

}
test();