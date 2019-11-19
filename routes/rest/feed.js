const express = require('express')

module.exports = serviceFeed => {
  const router = express.Router()

  router.get('/',  (req, res, next)=> {
  
    {  serviceFeed.getFeeds(new Date())(req.app.locals.lang)((error, data)=>
      {
       
        if(error)
        {
              
          if (req.app.locals.t["ERRORS"] === undefined || req.app.locals.t["ERRORS"]["FEEDS_ERROR"] === undefined || req.app.locals.t === undefined)
            res.status(500).json({"errors": [error.message]})
            
          else  
                
            res.status(500).json({"errors": [req.app.locals.t["ERRORS"]["FEEDS_ERROR"]]})

           

          }
        else
          res.status(200).json(data)
      })
    } 
  }
  )

  return router
}
