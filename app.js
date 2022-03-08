const zlib = require('zlib');
const fs = require('fs');
const versions = require('./versions.js')
const colors = require('colors')

async function read(filename){
  return new Promise((resolve, reject) => {
    fs.readFile("111.als", (err, buffer) => {
      if(err) throw "Error reading file. Does it exist?"
      resolve(buffer)
    })
  })
}

async function unzip(buffer){
  return new Promise((resolve, reject) => {
    zlib.unzip(buffer, (err, buffer) => {
      if(err) throw "Error unzipping file. Is this really an ableton project?"
      return resolve(buffer);
    });
  });
}

async function save(filename, text){
  return new Promise((resolve, reject)=>{
    fs.writeFile(filename, text, function (err) {
      if (err) return reject()
      console.log(`Saved ${filename}`);
      return resolve()
    });
  })
}

(async function () {

  if (!process.argv[2] || !process.argv[3] || !Object.keys(versions).includes(process.argv[3])){
    console.log(`This script will parse an Ableton file and change it's version delegation`.green)
    console.log(`Warning - This may not always work. Use at your own risk`.yellow)
    console.log()
    console.log(`Usage: node app.js [filename] [version]`)
    console.log()
    console.log(`Available Versions:\n${Object.keys(versions).join('\n')}`.grey)
    console.log(`Example: node app.js "Sick Tune-3.als" 11.0`.cyan)
    console.log()
  } else {
    let buffer = await read(process.argv[2])
    let xmlbuff = await unzip(buffer);
    let xml = xmlbuff.toString();
    let xmlArr = xml.split('\n')
    if (xmlArr[1].startsWith('<Ableton ')){
      console.log(`Looks good, converting... ${process.argv[3]} -> `)
      xmlArr[1] = versions[process.argv[3]]

      let newFileText = xmlArr.join('\n')
      let newFilenameArr = process.argv[2].split('.')
      newFilenameArr[newFilenameArr.length -2] +=  "-" + process.argv[3].replace(".","-")


      let newFilename = newFilenameArr.join(".")
      //console.log(newFilename)


      console.log(`Looks good, converting... ${process.argv[2]} -> ${newFilename}`)

      await save(newFilename, newFileText)


    } else {
      console.log(`We looked at the file, and something doesn't look quite right.`)
    }
  }
}());
