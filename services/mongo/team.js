/**
 * Fonction de rappel pour récupérer les membres du laboratoire.
 *
 * @callback teamCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableau de membres
 */

 
const getTeamMembers = db => callback => {
  // COMPLET
  db.collection('members').find({}).toArray(function(err, result) {
    if (err) callback(err, null)
    else{
      const team = ((result === null) ? [] : result)
        .sort((m1, m2) => {
          if (m1.lastname === m2.lastname) {
            return (m1.firstname < m2.firstname) ? -1 : (m1.firstname > m2.firstname) ? 1 : 0
          } else {
            return (m1.lastname < m2.lastname) ? -1 : 1
          }
        })
      callback(null, team)
    }
  });
}

module.exports = db => {
  return {
    getTeamMembers: getTeamMembers(db)
  }
}