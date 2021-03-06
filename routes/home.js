const express = require('express')
const router = express.Router()
const axios = require("axios")

const url = "http://localhost:3000/api/feed";


router.get('/', async (req, res, next)=> {

        try {
            const response = await axios.get(url);
            const data = response.data;
            res.render('index',{'feeds': data} )
            
            
          } catch (err) {
              next(err);
          }
    
   
    
    }
    )



module.exports = router
