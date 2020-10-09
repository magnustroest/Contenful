const contentful = require('contentful-management')

const client = contentful.createClient({
    accessToken: 'CFPAT-0OlCsvgV0ZMW6kdFRxE1StUSi7bEN4MxQPPWf9clovk'
})


client.getSpace('q8pwc6wr0xmf')
.then((space) => space.getEnvironment('master'))
.then((environment) => environment.getEntries())
.then((response) => console.log(response))
.catch(console.error)