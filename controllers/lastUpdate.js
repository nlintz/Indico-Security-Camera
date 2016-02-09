var lastUpdateModel = require('../models/lastUpdate');


exports.index = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    lastUpdateModel.findOne({}, function(err, update) {
        if (err) {
            console.log(err)
        }
        res.send(JSON.stringify(update));
    })
};

exports.update = function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var io = req.app.locals.io;
    lastUpdateModel.findOneAndUpdate({},
                                {updatedAt: Date.now()},
                                {upsert:true, new:true},
                                function(err, lastUpdate) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    lastUpdateModel.findOne({}, function(err, update) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            io.emit('last_update', JSON.stringify(update));
                                        }
                                    })
                                    res.send(JSON.stringify(lastUpdate));
                                });
};
