const express = require('express')
const router = express.Router()
const axios = require('axios')

// À COMPLÉTER
const url = "http://localhost:3000/api/members";

router.get('/', async (req, res, next)=> {


    try {
        const response = await axios.get(url, { headers: {'Content-Type' : '*/json', 'Accept': '*/json'} });
        const data = response.data;
        res.render('team',{'members': data} )
        
        
      } catch (err) {
          next(err);
      }



}
)
module.exports = router
