const { getTranslation } = require('../utils')
const ObjectId = require('mongodb').ObjectId

/**
 * Fonction de rappel pour récupérer les projets
 *
 * @callback projectsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de projets
 */

/**
 *  Obtenir les projets.
 *
 *  @param db - Base de données Mongo
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {projectsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjects = db => language => callback => {
  // À COMPLÉTER

 
  db.collection("projects").find({}).toArray(function(err, data){

    console.log("test",language)
    
    if (err){
      callback(err, null)
    } else 
    {
      
      const projects = ((data === null) ? [] : data)
        // .sort((p1, p2) => p1.year < p2.year ? 1 : p1.year > p2.year ? -1 : 0)
        .map(project => {
          const translatedTitle = getTranslation(language, project.title)
          const translatedDescription = getTranslation(language, project.description)
          
          return {
            ...project,
            title: translatedTitle,
            description: translatedDescription,
            publications: (project.publications === undefined) ? [] : project.publications
          }
        })
      callback(null, projects)

    }
  })
  
}

/**
 * Fonction de rappel pour récupérer un projet particulier
 *
 * @callback projectCallback
 * @param {Error} err - Objet d'erreur
 * @param {Object} result - Un projet particulier
 */

/**
 *  Obtenir un projet selon un identificatn.
 *
 *  @param db - Base de donnée Mongo
 *  @param {Object} translationObj - Objet qui contient l'ensemble des traductions définies
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {int} id - Identificant unique du projet à trouer
 *  @param {projectCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjectById = db => translationObj => language => id => callback => {
  // À COMPLÉTER
  console.log("len", language)
  db.collection('projects').find({_id : id}).toArray((err, data)=>{
    
    if(err)
    {
      callback(err,null)
    } else {
        if (data){
          callback(null, data)

        }else {
          const errorMsg = translationObj === undefined && translationObj['PROJECTS'] === undefined && translationObj['PROJECTS']['PROJECT_NOT_FOUND_MSG'] === undefined ? `${id} not found` : translationObj['PROJECTS'['PROJECT_NOT_FOUND_MSG']]
          const error = new Error(errorMsg)
          error.name = 'NOT_FOUND'
          callback(error, null)
        
        }

    }
  })
  callback()
}

module.exports = db => {
  return {
    getProjects: getProjects(db),
    getProjectById: getProjectById(db)
  }
}
