const fs = require('fs')
const path = require('path');
const { findHashContent } = require('./utils');
const zlib = require('zlib')


function commitTree(tree, message, parent = null) {
    const author = "Rajesh";
    const authorEmail = "tipstricks118@gmail.com";
    let contents = Buffer.from("tree" + tree + "\n");
    if (parent) {
      contents = Buffer.concat([contents, Buffer.from("parent" + parent + "\n")]);
    }
  
    const now = new Date();
    const timeStamp = now.valueOf();
    const offset = now.getTimezoneOffset();
    contents = Buffer.concat([
      contents,
      Buffer.from(`author ${author} <${authorEmail}> ${timeStamp} ${offset} \n`),
      Buffer.from(
        `committer ${author} <${authorEmail}> ${timeStamp} ${offset}\n`
      ),
    ]);
    contents = Buffer.concat([contents, Buffer.from(message + "\n")]);
    const header = "commit" + contents.length + "\0";
    const data = Buffer.concat([Buffer.from(header), contents]);
    const hash = findHashContent(data);
    const dirPath = path.join(__dirname, ".git", "objects", hash.slice(0, 2));
    fs.mkdirSync(dirPath, {
      recursive: true,
    });
    const compressed = zlib.deflateSync(data);
    fs.writeFileSync(path.join(dirPath, hash.slice(2)), compressed);
    process.stdout.write(hash + "\n");
    return hash;
  }

  module.exports={commitTree}
