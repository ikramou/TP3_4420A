const express = require('express')
const async = require('async')

module.exports = servicePublication => {
const router = express.Router()

  
  // À COMPLÉTER
  router.get('/',(req,res,next)=>{

    const sortBy= req.query.sort_by
    const orderBy=req.query.order_by
    var sort =[]

    if (sortBy  && orderBy)
      if (sortBy === "title")
        sort = [['title', orderBy]]
      else
        sort = [['year', orderBy], ['month', orderBy]]
    else
        sort = [['title', 'desc']]//,['year', 'desc'], ['month', 'desc']]

    var paginationOp = 
      {
        
          pageNumber: (req.query.page) ? req.query.page : 1,
          limit: (req.query.limit) ? req.query.limit : 10,
          sorting: sort
        
      }
    

    
    
      
    servicePublication.getPublications(paginationOp)( async (err,publis)=>{

      if(err){

        if (req.app.locals.t["ERRORS"] === undefined || req.app.locals.t["ERRORS"]["PUBS_ERROR"] === undefined)
          res.status(500).json({"errors": [err.message] })
          
        else
          res.status(500).json({ "errors": [req.app.locals.t["ERRORS"]["PUBS_ERROR"]] })
         

      }

      else

        try {

          const publisLength = await servicePublication.getNumberOfPublications((err, nbPubs) => { 
            
            

            if(publis!== undefined && nbPubs !== undefined)
              pubs = {
                count: nbPubs,
                publications: publis,
              
              }
              
              
                res.status(200).json(pubs)
            
          
          });     
        
        
        
        }
        catch(e) {next(e.message)}
    }
      )
    
  })




   router.post('/',  (req,res,next)=>{

    
     
    servicePublication.createPublication(req.body)((err, data)=>{

  
      if (err)
        
        
        {
          
          if (req.app.locals.t["ERRORS"] === undefined  || req.app.locals.t["ERRORS"]["PUB_CREATE_ERROR"])
            res.status(500).json({ "errors": [err.message] })
          else
            res.status(500).json({"errors":[req.app.locals.t["ERRORS"]["PUB_CREATE_ERROR"]]})
        }
        
      else

        {
          var list=[]
          
          if (req.body === undefined || req.body === null)  
            {
              if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["EMPTY_PUBLICATION_FORM"] !== undefined)
              {
                res.status(400).json({"errors":[req.app.locals.t["ERRORS"]["EMPTY_PUBLICATION_FORM"]]})
                list.push(req.app.locals.t["ERRORS"]["EMPTY_PUBLICATION_FORM"])
              }
            }

          else
          
            {
              if(req.body.authors === undefined) 
                {
                  if  (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["AUTHOR_EMPTY_FORM"] !== undefined)
                  {
                    res.status(400).json({"errors":[req.app.locals.t["ERRORS"]["AUTHOR_EMPTY_FORM"]]})
                    list.push(req.app.locals.t["ERRORS"]["AUTHOR_EMPTY_FORM"]) 
                  }
                }


              if ( req.body !== undefined && (req.body.year === undefined || isNaN(req.body.year) || req.body.year<0))
                {
                  if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["YEAR_NOT_INT_FORM"] !== undefined)
                  {
                    res.status(400).json({"errors":[req.app.locals.t["ERRORS"]["YEAR_NOT_INT_FORM"]]})
                    list.push(req.app.locals.t["ERRORS"]["YEAR_NOT_INT_FORM"])
                  }
                }

              if ( req.body !== undefined && (req.body.month === undefined || isNaN(req.body.month) || req.body.month<0 || req.body.month>11))
            
                if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["MONTH_ERROR_FORM"] !== undefined)
                  {
                    res.status(400).json({"errors":[req.app.locals.t["ERRORS"]["MONTH_ERROR_FORM"]]})
                    list.push(req.app.locals.t["ERRORS"]["MONTH_ERROR_FORM"])
                  }


              if ( req.body !== undefined && (req.body.title === undefined || (req.body.title).length < 5))
                if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["PUB_AT_LEAST_5_CHAR_FORM"] !== undefined)
                  {
                    res.status(400).json({"errors":[req.app.locals.t["ERRORS"]["PUB_AT_LEAST_5_CHAR_FORM"]]})
                    list.push(req.app.locals.t["ERRORS"]["PUB_AT_LEAST_5_CHAR_FORM"])
                  }

              if ( req.body !== undefined && (req.body.venue === undefined || (req.body.venue).length < 5))
                if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["VENUE_AT_LEAST_5_CHAR_FORM"] !== undefined)
                {
                  res.status(400).json({"errors":[req.app.locals.t["ERRORS"]["VENUE_AT_LEAST_5_CHAR_FORM"]]})
                  list.push(req.app.locals.t["ERRORS"]["PUB_AT_LEAST_5_CHAR_FORM"])
                }
              
              }

          if (list.length>0)
            res.status(400).json({"errors": list})
        
          else
            res.sendStatus(201).end()
        

      }

     }  )
  }) 


  router.delete('/:id',(req,res,next)=>{
    
    servicePublication.removePublication(req.params.id)((err,publications)=>{
    if(err){

      if (err.name === "NOT_FOUND")
        {
          if (req.app.locals.t["ERRORS"] === undefined  && req.app.locals.t["ERRORS"]["PUB_DELETE_ERROR"])
            res.status(404).json({"errors":[err.message]})
          else
            res.status(404).json({ "errors": [ req.app.locals.t["ERRORS"]["PUB_DELETE_ERROR"]] })
        }

      else


        if (req.app.locals.t["ERRORS"] === undefined  && req.app.locals.t["ERRORS"]["PUB_DELETE_ERROR"])
          res.status(500).json({"errors":[err.message]})

        else
          res.status(500).json({ "errors": [ req.app.locals.t["ERRORS"]["PUB_DELETE_ERROR"]] })
    }
    else   
      res.status(200).send('done')
  })
  })

  return router
}


