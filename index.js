let express = require('express')

let mineType = require('mime-types');
let fs = require('fs')
let request = require('request')
let app = express()
var jsonfile = require('jsonfile')
let multipart = require('connect-multiparty');

var PDFImage = require("pdf-image").PDFImage;
var sizeOf = require('image-size');
var pdfImage = new PDFImage("./a.pdf");

const sharp = require('sharp');

app.set('view engine','ejs')

app.get('/',(req,res)=>{
  console.log(req.files)
  res.render('index')
})



app.post('/upload',multipart(),async function(req, res) {

  let cb =async function(req,res,p) {

    var dimensions = sizeOf(p);

    let width,height

    if(dimensions.width>dimensions.height){
      width = 800
      height =Math.floor( dimensions.height * 800 / dimensions.width)
    }else {
      height = 800
      width =Math.floor( dimensions.width * 800 / dimensions.height)
    }

    await sharp(p)
      .resize(width, height)
      .toFile('./temp.png')

    var dimensions = sizeOf('./temp.png');
    console.log(dimensions)
    let data = fs.readFileSync('./temp.png')
    console.log(data,'data')

    data = new Buffer(data).toString('base64');


    var formData = {
      // Pass a simple key-value pair
      "api_key":'tmD-RlJfiw4IdBC6TV5M1pAhn7y2elj2',
      "api_secret":'2WrohOvUZGtbzazkCg1Bw7wKJ7jhjn4Q',
      "image_base64":data
    };



    request.post({url:'https://api-cn.faceplusplus.com/imagepp/v1/recognizetext', form: formData}, function (error, response, body) {
      console.error(body)
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body)
        jsonfile.writeFileSync('a.json',data)
        jsonfile.spaces = 4
        data = data.result.map((item)=>{
          return item.value
        })
        res.send(data)

      }else {
        console.error(error)
        res.send({error:'图片尺寸或者格式有错误'})
      }
    })
  }

  var pdfImage = new PDFImage(req.files.sr.path);
  console.log('sss')
  pdfImage.convertPage(2).then(function (imagePath) {
    console.log(imagePath)
    cb(req,res,imagePath)
  })


})

app.listen(3000)
