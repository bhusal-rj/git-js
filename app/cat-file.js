const path=require('path')
const zlib=require('zlib')
const fs = require('fs')
function getCatFile() {
    const flag = process.argv[3];
    switch (flag) {
      case "-p":
        const objectHash = process.argv[4];
        //first two letters are of folder name out of 40 characters
        const folderName = objectHash.slice(0, 2);
        const fileName = objectHash.slice(2, objectHash.length);
        const contentsOfFile = fs.readFileSync(
          path.join(__dirname, ".git/objects", folderName, fileName)
        );
        const decoded = zlib.inflateSync(contentsOfFile);
        const content = decoded.toString("utf-8").split("\0")[1];
        process.stdout.write(content);
        break;
    }
  }

module.exports ={getCatFile}