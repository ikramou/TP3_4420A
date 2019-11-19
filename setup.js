const MongoClient = require('mongodb').MongoClient
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('./config.json')


async function main(){
    const client = new MongoClient(config.dbUrl, { useNewUrlParser: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  delCollections(client);        
        await loadYaml(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function loadYaml(client){
    try {
    const news = await yaml.safeLoad(fs.readFileSync('data/news.yml', 'utf8'));
    const seminars = await yaml.safeLoad(fs.readFileSync('data/seminars.yml', 'utf8'));
    const team = await yaml.safeLoad(fs.readFileSync('data/team.yml', 'utf8'));
    const publications = await yaml.safeLoad(fs.readFileSync('data/publications.yml', 'utf8'));
    const projects = await yaml.safeLoad(fs.readFileSync('data/projects.yml', 'utf8'));

    await client.db("TP3").createCollection('news')
    await client.db("TP3").collection('news').insertMany(news);
    
    await client.db("TP3").createCollection('seminars')
    await client.db("TP3").collection('seminars').insertMany(seminars);

    await client.db("TP3").createCollection('members')
    await client.db("TP3").collection('members').insertMany(team);

    await client.db("TP3").createCollection('publications')
    insertedPublications = await client.db("TP3").collection('publications').insertMany(publications);
    

    await client.db("TP3").createCollection('projects')
    insertedProjects = await client.db("TP3").collection('projects').insertMany(projects);
    
      
    await insertedProjects.ops.forEach(async function(doc) {          
        if(doc.publications !== undefined){            
            insertedPublications.ops.forEach(function(he){
                for(i = 0; i< doc.publications.length; i++){           
                    if(doc.publications !== undefined && doc.publications[i] === he.key)
                        client.db("TP3").collection('projects').updateOne({ publications : doc.publications[i]}, { $set: { "publications.$": he._id} })                    
                }
            })
        }               
    })

    await client.db("TP3").collection('publications').updateMany({},{$unset: {key:1}},{multi: true})

  
    } catch (e) {
        console.log(e);
    }
}
async function delCollections(client){
    collectionList = await client.db('TP3').listCollections()
    await collectionList.toArray().then((docs) => {
        docs.forEach((doc) => {
            client.db('TP3').collection(doc.name).drop()            
        });
    })
    
}

main().catch(console.err);