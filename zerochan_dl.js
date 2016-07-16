'use strict';
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

function zerochanPageImages(tag,page,cb){
    request(`http://www.zerochan.net/${tag}?s=id&p=${page}`,(err,res,body)=>{
        if(err || res.statusCode!== 200){
        throw new Error("Error loading page" + `http://www.zerochan.net/${tag}?s=id&p=${page}`);
    }
    const $ = cheerio.load(body);
    const $images = $("li>a>img");
    const images = [];
    for(let i = 0; i < $images.length; i++){
        images.push($images[i].attribs.src.replace(/\.240\./,'.full.'));
    }
    cb(images);
});
}

function zerochanPageSaveImages(path,tag,page){
    console.log(`[Page ${page}] ${tag}`);
    const cb = (images)=>{
        const loop = (i)=>{
            if(i==images.length){
                zerochanPageSaveImages(path,tag,page+1);
            }
            else{
                const image_name = images[i].split('/').pop();
                console.log(`[Page ${page}] Saving ${image_name}`);
                try{
                    fs.accessSync(path+image_name,fs.constants.F_OK);
                    console.log(`[Page ${page}] ${image_name} already exists, skipping`);
                    loop(i+1);
                }
                catch(e){
                    const stream = request(images[i]).pipe(fs.createWriteStream(path+image_name));
                    stream.on('finish',()=>loop(i+1));
                }
            }
        };
        loop(0);
    };
    zerochanPageImages(tag,page,cb);
}

module.exports = zerochanPageSaveImages;