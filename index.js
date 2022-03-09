#! /usr/bin/env node

const zlib = require('zlib');
const fs = require('fs');
const versions = require('./versions.js')
const colors = require('colors')

async function read(filename){
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, buffer) => {

      if(err) return reject("Error reading file. Does it exist?")
      resolve(buffer)
    })
  })
}

async function unzip(buffer){
  return new Promise((resolve, reject) => {
    zlib.unzip(buffer, (err, buffer) => {

      if(err) reject("Error unzipping file. Is this really an ableton project?")
      return resolve(buffer);
    });
  });
}

async function save(filename, text){
  return new Promise((resolve, reject)=>{
    fs.writeFile(filename, text, function (err) {
      if (err) return reject("Couldn't save...")
      console.log(`Saved ${filename}`);
      return resolve()
    });
  })
}

(async function () {
  let filename = process.argv[2]
  let version = process.argv[3]

  if (!filename || !version || !Object.keys(versions).includes(version)){
    console.log(`This script will parse an Ableton file and change it's version delegation`.green)
    console.log(`Warning - This may not always work. Use at your own risk`.yellow)
    console.log()
    console.log(`Usage: node app.js [filename] [version]`)
    console.log()
    console.log(`Available Versions:\n${Object.keys(versions).join('\n')}`.grey)
    console.log(`Example: node app.js "Sick Tune-3.als" 11.0`.cyan)
    console.log()
  } else {

    let buffer,xmlbuff,xml
    try{
      buffer = await read(filename)
      xmlbuff = await unzip(buffer);
      xml = xmlbuff.toString();
    } catch(e){
      console.log(e)
      process.exit(1)
    }

    let xmlArr = xml.split('\n')
    if (xmlArr[1].startsWith('<Ableton ')){
      console.log(`Looks good, converting... ${version} -> `)
      xmlArr[1] = versions[version]
      let newFileText = xmlArr.join('\n')
      let newFilenameArr = filename.split('.')
      newFilenameArr[newFilenameArr.length -2] +=  "-" + version.replace(".","-")
      let newFilename = newFilenameArr.join(".")
      console.log(`Looks good, converting... ${filename} -> ${newFilename}`)
      await save(newFilename, newFileText)
    } else {
      console.log(`We looked at the file, and something doesn't look quite right.`)
    }
  }
}());
