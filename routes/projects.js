const express = require('express')
const router = express.Router()
const axios = require('axios')

var url = "http://localhost:3000/api/projects";


router.get('/', async (req, res, next) => {

  if (req.query.clang)
    url = url+'/?clang='+req.query.clang
  
    {
        try {
          const response = await axios.get(url);
          const data = response.data;
          res.render('projects',{'projects':data})
        } catch (error) {
          next(error)
        }
      };
     
})



router.get('/:id', (req, res, next) => {

    const params = {id: req.params.id}
    
   
    const getData = async url => {
        try {
          if (req.query.clang)
            query= { clang: req.query }
          else 
            query={}

                  
          const response = await axios.get(url+'/'+params.id, {query: query});
          
          const data = response.data;
          res.render('project',{'project':data.project,'publications':data.publications})
        } catch (error) {
          next(error)
        }
      };
      getData(url);
    
})
module.exports = router
