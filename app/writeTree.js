const fs = require('fs')
const path = require('path');
const zlib = require('zlib')
const { writeToBlob, findHashContent } = require('./utils');

function writeTree(dir = __dirname) {
    const filesAndDirs = fs
      .readdirSync(dir)
      .filter((f) => f !== ".git" && f !== "main.js");
    const entries = [];
    for (const file of filesAndDirs) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile()) {
        entries.push({
          mode: 100644,
          name: file,
          hash: writeToBlob(fullPath),
        });
      } else {
        entries.push({
          mode: 40000,
          name: file,
          hash: writeTree(path.join(dir, file)),
        });
      }
    }
    const contents = entries.reduce((acc, { mode, name, hash }) => {
      return Buffer.concat([
        acc,
        Buffer.from(`${mode} ${name}\0`),
        Buffer.from(hash, "hex"),
      ]);
    }, Buffer.alloc(0));
    const treeContents = Buffer.concat([
      Buffer.from(`tree ${contents.length}\x00`),
      contents,
    ]);
    const treeHash = findHashContent(treeContents);
    fs.mkdirSync(path.join(__dirname, ".git", "objects", treeHash.slice(0, 2)), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(
        __dirname,
        ".git",
        "objects",
        treeHash.slice(0, 2),
        treeHash.slice(2)
      ),
      zlib.deflateSync(treeContents)
    );
    return treeHash;
  }

  module.exports={writeTree}