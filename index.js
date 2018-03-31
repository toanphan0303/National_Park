const https = require('https')
const pem = require('pem')
const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production'){
  const app = require('./server/server');
  app.listen(PORT || 5000, () =>{
    console.log('app listening on port', PORT)
  })
} else {
  pem.createCertificate({ days: 1, selfSigned: true}, (err, keys) =>{
    if(err){
      throw err
    }
    const app = require('./server/server');
    console.log('app listening on port', PORT)
    https.createServer({ key: keys.serviceKey, cert: keys.certificate}, app).listen(PORT)
  })
}
