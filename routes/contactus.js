var express = require('express');
var router = express.Router();
const fs = require("fs"); 
var bodyParser = require('body-parser');

var expressValidator = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contactus', { title: 'Contact Us', message:'', errors:{} });
});


/* POST */
router.post('/', expressValidator(), function(req, res, next) { 

   req.assert('name', 'Name is required').notEmpty();           //Validate name
    req.assert('message', 'Message is required').notEmpty();  //Validate message

    var errors = req.validationErrors();
     
    if( !errors){   //No errors were found.  Passed Validation!        
        
        var postData = ""; 
        req.setEncoding("utf8"); 
        req.addListener("data", function(postDataChunk) { 
            console.log(`ChunckSize: ${postDataChunk.length}`)
            postData += postDataChunk; 
        }); 
        
        req.addListener("end", function() { 
            //res.end('Thank you ' +req.body.name);
            res.render('contactus', { title: 'Contact Us', message: 'Thank You',errors: {} });
             
             console.log(`postData: ${postData}`)

             fs.writeFile('contactdata.txt',postData);
            
        });
       
    }
    else {   //Display errors to user
        res.render('contactus', { 
            title: 'Contact Us',
            message: '',
            errors: errors
        });

    }
 
        
    });

module.exports = router;
