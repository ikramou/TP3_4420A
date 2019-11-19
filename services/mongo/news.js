const moment = require('moment')
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les nouvelles
 *
 * @callback newsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de nouvelles
 */

/**
 *  Obtenir les nouvelles.
 *
 *  @param db - Base de données Mongo
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {newsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNews = db => language => callback => {
  // À COMPLÉTER

  
  
    //const news = db.collection('news')
    //new.find({}).toArray().then(response => res.status(200).json(response)).catch(error => console.error(error));
    callback(null, [])
}

module.exports = db => {
  return {
    getNews: getNews(db)
  }
}
