const express = require('express')
const async = require('async')

module.exports = servicePublication => {
const router = express.Router()

  
function handelError(req, res,next){
  var list = [];
  const body =req.body
  

  if (body === undefined || body === null)  
  {
    if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["EMPTY_PUBLICATION_FORM"] !== undefined)
    {
      
      list.push(req.app.locals.t["ERRORS"]["EMPTY_PUBLICATION_FORM"])
    }
  }

  else

  {

    if(body.authors === undefined) 
      {
        if  (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["AUTHOR_EMPTY_FORM"] !== undefined)
        {
          
          list.push(req.app.locals.t["ERRORS"]["AUTHOR_EMPTY_FORM"]) 
          
        }
        
      }


    if (body.year === undefined || isNaN(body.year) || body.year<0)
      {
        if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["YEAR_NOT_INT_FORM"] !== undefined)
        {
          
          list.push(req.app.locals.t["ERRORS"]["YEAR_NOT_INT_FORM"])
        }
      }

    if (body.month === undefined || isNaN(body.month) || body.month<0 || body.month>11)
  
      if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["MONTH_ERROR_FORM"] !== undefined)
        {
          
          list.push(req.app.locals.t["ERRORS"]["MONTH_ERROR_FORM"])
        }


    if ( body.title === undefined || (body.title).length < 5)
      {
        if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["PUB_AT_LEAST_5_CHAR_FORM"] !== undefined)
        {
          
          list.push(req.app.locals.t["ERRORS"]["PUB_AT_LEAST_5_CHAR_FORM"])
          

        }
      
      }
      

    if ( body.venue === undefined || (body.venue).length < 5)
      if (req.app.locals.t["ERRORS"] !== undefined && req.app.locals.t["ERRORS"]["VENUE_AT_LEAST_5_CHAR_FORM"] !== undefined)
      {
        
        list.push(req.app.locals.t["ERRORS"]["VENUE_AT_LEAST_5_CHAR_FORM"])
        
        
      }
    
  }



  return list
}

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

           await servicePublication.getNumberOfPublications((err, nbPubs) => { 
            
            

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
          
          if (req.app.locals.t["ERRORS"] === undefined  && req.app.locals.t["ERRORS"]["PUB_CREATE_ERROR"])
            res.status(500).json({ "errors": [err.message] })
          else
            res.status(500).json({"errors":[req.app.locals.t["ERRORS"]["PUB_CREATE_ERROR"]]})
        }
        
      else

        {
         const errorArray = handelError(req, res,next)
         
         if (errorArray.length>0)
            res.status(400).json({"errors": errorArray})
        
          else
            res.status(201).json(data)
          
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


