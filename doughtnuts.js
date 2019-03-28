var restify = require('restify');
var fs = require('fs');

function OrderMyDonot(req, res, next) {
  fs.readFile('data/data.json',function(err,content){
    if(err) throw err;
    data = JSON.parse(content);
    data.orders.push({name:req.body.name, order:req.body.donot, date:(new Date()).toString()});

    fs.writeFile('data/data.json',JSON.stringify(data),function(err){
      if(err) throw err;
      res.send(`Saved`);
      next();
    });
  })
}

function WhatDidIChoose(req, res, next){
  fs.readFile('data/data.json',function(err,content){
    if(err) throw err;
    res.send(JSON.parse(content).orders.filter(n => n.name == req.body.name).sort((a,b) => new Date(b.date) - new Date(a.date))[0]);
    next();
  })
}

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/OrderMyDonot', OrderMyDonot);
server.post('/WhatDidIChoose', WhatDidIChoose);
server.get('/*', restify.plugins.serveStaticFiles('./static'));

server.listen(80, function() {
  console.log('%s listening at %s', server.name, server.url);
});