const path=require('path')
const fs = require('fs')
const zlib=require('zlib')

function lsTree() {
    const isNameOnly = process.argv[3];
    let hash = "";
    if (isNameOnly === "--name-only") {
      //display the name only
      hash = process.argv[4];
    
    const dirName = hash.slice(0, 2);
    const fileName = hash.slice(2);
    const objectPath = path.join(__dirname, ".git", "objects", dirName, fileName);
    const dataFromFile = fs.readFileSync(objectPath);
  
    //decrypt the data from the file
    const inflated = zlib.inflateSync(dataFromFile);
  
    //notice before encrypting the data what we do was we encrypt
    //blob length/x00 so to get the previous string back what we need to do is split with /xoo
    const enteries = inflated.toString("utf-8").split("\x00");
  
    //enteries will be [blob length/x00, actual_file_content]
    const dataFromTree = enteries.slice(1);
    const names = dataFromTree
      .filter((line) => line.includes(" "))
      .map((line) => line.split(" ")[1]);
    const namesString = names.join("\n");
    const response = namesString.concat("\n");
    //this is the regex pattern that tells to replace multiple global \n with single \n
    process.stdout.write(response.replace(/\n\n/g, "\n"));
  }
}
  module.exports={lsTree}