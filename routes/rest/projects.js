const express = require('express')
const async = require('async')

module.exports = (serviceProjects, servicePublication) => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/', (req, res, next) => {
    
    serviceProjects.getProjects(req.app.locals.lang)((err, data)=> 
    {
      
      if(err)
        {
        if( req.app.locals.t["ERRORS"] === undefined && req.app.locals.t["ERRORS"]["PROJECTS_ERROR"] === undefined)
          res.status(500).json({"errors":[err.message]})
        else
          res.status(500).json({"errors": [req.app.locals.t["ERRORS"]["PROJECTS_ERROR"]]})
        }
      else 


        res.status(200).json(data)
    }

    )})

  router.get('/:id',(req, res, next) => { 
    
    
    serviceProjects.getProjectById(req.app.locals.lang)('en')(req.params.id)((err, data)=> 
    
      
    {
      
      if (err)
      
        {
          console.log(err.message)
          
          if(err.name === 'NOT_FOUND')
            if( req.app.locals.t["ERRORS"] === undefined || req.app.locals.t["ERRORS"]["PROJECT_NOT_FOUND"] === undefined)
              res.status(404).json({"errors":[err.message]})
            else
              res.status(404).json({"errors": [req.app.locals.t["ERRORS"]["PROJECT_NOT_FOUND"]+req.params.id]})

          else
          {
            
            if (req.app.locals.t["ERRORS"] === undefined || req.app.locals.t["ERRORS"]["PROJECTS_ERROR"] === undefined)
              res.status(500).json({"errors":[err.message]})
            else
              console.log("erreur", err.errors )
              res.status(500).json({"errors": [req.app.locals.t["ERRORS"]["PROJECTS_ERROR"]]})
          }
              
        }
      else 
        console.log("pubs", data.publications)
        servicePublication.getPublicationsByIds(data.publications)((err,pubs)=>{
          if (err)
            next(err)

          else
            theProject = {project : data, publications : pubs}
            
            res.json(theProject)
          
      })
  
    }

    )
  }
    
    )

  return router
}
