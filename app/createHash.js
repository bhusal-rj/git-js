const { writeToBlob } = require("./utils");
const path = require('path')
const fs = require('fs')

function createHashObject() {
    const flag = process.argv[3];
    switch (flag) {
      case "-w":
        const nameFile = process.argv[4];
        process.stdout.write(writeToBlob(path.join(__dirname, nameFile)));
        break;
    }
  }

  module.exports={createHashObject}