var cardValidator = require('../validator');

module.exports = 
{
    Validate : function(req, res, next)
    {
        let validationData = req.body;    
        let results = cardValidator.Validate(validationData);
        res.status(results.code).json(results); 
    }
};