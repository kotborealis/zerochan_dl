#! /usr/bin/env node
const fs = require('fs');
const zerochan_dl = require("./zerochan_dl");

if(process.argv.length<5){
    console.log("Usage: zerochan_dl /path/to/save/dir/ tag starting_page");
}
else{
    const path = process.argv[2].toString();
    fs.accessSync(path,fs.constants.W_OK);
    const tag = process.argv[3].toString();

    let starting_page = parseInt(process.argv[4]);
    if(Number.isNaN(starting_page))
        starting_page = 0;
    
    zerochan_dl(path,tag,starting_page);
}