module.exports = 
{
    Index : function(req, res, next)
    { 
        res.render('start');
    },

    Start : function(req, res, next)
    { 
        res.render('order');
    },

    Complete : function(req, res, next)
    {             
        res.render('complete');
    }
};