const express = require('express');
const router = express.Router();
const GoogleImages = require('google-images');
const Jimp = require('jimp');

const CSE = '001235259831826712087:b8z41ttofbu';
const APIKEY = 'AIzaSyB1AD3G0sgsjpxh7YLg4N8OS2IKNXuSfjk';

const History = require("../models/historyModel");

const client = new GoogleImages(CSE, APIKEY);
const download = require('image-downloader')


var promiseWala = function (args) {
  return new Promise(function(resolve, reject) {
    let name = new Date().getTime()
    const options = {
      url: args,
      dest: './static/images/'+name+'.jpg'                  // Save to /path/to/dest/image.jpg
    }
    download.image(options)
      .then(({ filename, image }) => {
        console.log('File saved to', filename)
        Jimp.read('./static/images/'+name+'.jpg', (err, lenna) => {
          if (err){
            console.log(err);
            resolve('');
          };
          if (lenna) {
            lenna
              .quality(30) // set JPEG quality
              .greyscale() // set greyscale
              .write('./static/images/'+name+'.jpg'); // save
              let toRet = './static/images/'+name+'.jpg'
               resolve(toRet);
          }else {
              resolve('');
          }
        });
      })
      .catch((err) => {
        console.error(err)
        resolve('');
      })
  })
}

router.get('/searchImage/:keyword', (req, res, next) => {
  const toBeSearched = req.params.keyword;

  client.search(toBeSearched, {size: 'small'})
    .then(images => {
      var imagesObj = images
      imagesObj = imagesObj.splice(0,10);


      // var imagesObj = [{
      //     url: 'https://www.91-img.com/pictures/126849-v6-honor-10-mobile-phone-large-1.jpg',
      //     thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShXgmDi8RNhtQs1ROt5KaF70WElMMkCzUrKoLM4m9mkg1Nv-XbGl-qdw',
      //     snippet: 'Honor 10 Price in India, Full Specs (2nd April 2019) | 91mobiles.com',
      //     context: 'https://www.91mobiles.com/honor-10-price-in-india'
      //   },
      //   {
      //     url: 'https://searchengineland.com/figz/wp-content/seloads/2016/08/google-mobile-smartphone-asus-android1-ss-1920.jpg',
      //     thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOSXq-cDv024Mt57sNuLcmT68oEjqyua4UD_dznEEwtg39vmHRvY4HZCah',
      //     snippet: 'Google begins rolling out mobile-first indexing to more sites ...',
      //     context: 'https://searchengineland.com/google-begins-rolling-out-mobile-first-indexing-to-more-sites-295095'
      //   }, {
      //     url: 'https://lh3.googleusercontent.com/re65G-N_kR2HUCzd4IUjahS_7u_uFicBEISxRmFOYNMafrdWfNw7Ucw6cB1Hgky0VewtzDn1aMmXItWIBLiAnFmf7qysCXK0dRgY',
      //     thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3wj-ig5rvf4-3ivPZrcvFpp8U1aaBgfbxeGRqZU1zbeJDbNVkrvBbVHGZSA',
      //     snippet: 'Google Mobile Management: MDM Solution | G Suite',
      //     context: 'https://gsuite.google.com/products/admin/mobile/'
      //   }, {
      //     url: 'https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/lg/lg-g7-thinq/gray/LG-G7-ThinQ-Gray-1-3x.jpg',
      //     thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT5I1UNJXz2eZ9by3fuZDDjD9DE-BfpCFTm0Qv314dxNasmgV-lLMycu9D',
      //     snippet: 'LG G7 ThinQ | LG G7 ThinQ Reviews, Tech Specs, Price & More | T-Mobile',
      //     context: 'https://www.t-mobile.com/cell-phone/lg-g7-thinq'
      //   }, {
      //     url: 'https://static.digit.in/product/db4f8c4a4fa4e69ed2b603c2d13b9064b974ba0b.jpeg',
      //     thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2O6QaK8PXrG7bN3h5l3D6rwGzwFW0ppr5Yn7zKJry1crccrk_YxlwXUc',
      //     snippet: 'Mafe Mobile Shine M815 Price in India, Full Specs - April 2019 | Digit',
      //     context: 'https://www.digit.in/mobile-phones/mafe-mobile-shine-m815-price-69126.html'
      //   }, {
      //     url: 'https://ondav.com/wp-content/uploads/2018/04/samsung_mobile_under_15000.jpg',
      //     thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuVnByL3bbUvvtIuPz53vxcOcrYjekbPL1P6yApPsVaW2vXwslWJoSkI8q',
      //     snippet: 'Mobile pace case research: Push for quicker page hundreds | On Dav',
      //     context: 'https://ondav.com/mobile-pace-case-research-push-for-quicker-page-hundreds/'
      //   }
      // ]
      res.status(200).json(imagesObj)
      async function someFun() {
        let toReturn = []
        for (const item of imagesObj) {
          toReturn.push(await promiseWala(item.url))
        }
        return toReturn;
      }
      someFun().then(function (args) {
        var history = new History({
          keyword: toBeSearched,
          searched_on: new Date(),
          images: args
        })
        console.log(history);
        history.save().then(response => {
          // res.status(200).json(imagesObj)
        })
      }).catch(function (err) {
        console.log(err);
      })


    });


});


module.exports = router;
