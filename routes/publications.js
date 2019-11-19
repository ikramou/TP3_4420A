const express = require('express')
const router = express.Router()
const moment = require('moment')
const axios = require('axios')

// À COMPLÉTER
const url = "http://localhost:3000/api/publications";

async function  getPublications(req,res,next){
    const page=req.query.page
    const limit = req.query.limit
    const sortBy= req.query.sort_by
    const orderBy=req.query.order_by
    var sort =[]
    try {

        if (sortBy || orderBy)
        if (sortBy === "title")
            sort = [['title', orderBy]]
        else
            sort = [['year', orderBy], ['month', orderBy]]
        else
            sort = [['title', 'desc']]//,['year', 'desc'], ['month', 'desc']]

        var paginationOp = 
        {
            
            pageNumber: (page) ? page : 1,
            limit: (limit) ? limit : 10,
            sorting: sort
            
        }
        
                
        const response = await axios.get(url+"?page="+paginationOp.pageNumber+"&limit="+paginationOp.limit+"&sort_by="+sortBy+"&order_by="+orderBy);
        const data = response.data;
        res.render('publication',{'publications':data.publications, 'pagingOptions': paginationOp ,'numberOfPages': Math.ceil((data.count)/(paginationOp.limit)), 'monthNames': moment.months(), 'pubFormErrors':[]} )
        

      } catch (error) {
          
        if (error.errors === undefined || error.errors === null)   {
            next(error)
          
        }
        else if (data.status === 400){
            
            res.render('publication',{'pubFormErrors': data.errors} );
         
        }
        
      }
}


router.get('/', async (req, res, next)=> {
    

      getPublications(req,res,next)

       
})

router.post('/', async (req, res, next)=> {

   
    const response = await axios.post(url, {
        title: req.body.title,
        month: req.body.month,
        year: req.body.year,
        authors: req.body.authors,
        venue: req.body.venue }, { headers: {'Content-Type' : '*/json', 'Accept': '*/json'} , timeout: 140000})

        .then(response => {
                if (response.status === 201)
                    getPublications(req,res,next).catch((e)=>next(e))
            
        })   
          
})

router.delete('/', async (req, res, next)=> {
    console.log(1)
   
    const response = await axios.delete(url, { params:{id: req.query.id }}).catch((e)=>next(e)) 
    console.log(response)

           return response
})

module.exports = router
