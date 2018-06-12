let express = require('express')

let mineType = require('mime-types');
let fs = require('fs')
let request = require('request')
let app = express()
var jsonfile = require('jsonfile')
let multipart = require('connect-multiparty');
app.set('view engine','ejs')

app.get('/',(req,res)=>{
  console.log(req.files)
  res.render('index')
})



app.post('/upload',multipart(),async function(req, res) {
  let data = fs.readFileSync(req.files.sr.path)
  data = new Buffer(data).toString('base64');



  var formData = {
    // Pass a simple key-value pair
    "api_key":'tmD-RlJfiw4IdBC6TV5M1pAhn7y2elj2',
    "api_secret":'2WrohOvUZGtbzazkCg1Bw7wKJ7jhjn4Q',
    "image_base64":data
  };

  request.post({url:'https://api-cn.faceplusplus.com/imagepp/v1/recognizetext', form: formData}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body)
      jsonfile.writeFileSync('a.json',data)
      jsonfile.spaces = 4
      data = data.result.map((item)=>{
        return item.value
      })
      res.send(data)

    }else {

      res.send({error:'图片尺寸或者格式有错误'})
    }
  })

})

app.listen(3000)
