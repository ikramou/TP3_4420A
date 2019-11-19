const express = require('express')
const router = express.Router()
const axios = require('axios')

const url = "http://localhost:3000/api/projects";


router.get('/', async (req, res, next) => {
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
            
          const response = await axios.get(url+'/'+params.id);
          
          const data = response.data;
          res.render('project',{'project':data.project,'publications':data.publications})
        } catch (error) {
          next(error)
        }
      };
      getData(url);
    
})
module.exports = router


module.exports = router
