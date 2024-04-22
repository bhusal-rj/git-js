const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");
const { getCatFile } = require("./cat-file");
const { createGitDirectory } = require("./createDirectory");
const { writeTree } = require("./writeTree");
const { lsTree } = require("./lsTree");
const { createHashObject } = require("./createHash");
const { commitTree } = require("./commitTree");

const command = process.argv[2];
switch (command) {
  case "init":
    createGitDirectory();
    break;

  case "cat-file":
    getCatFile();
    break;

  case "hash-object":
    createHashObject();
    break;

  case "ls-tree":
    lsTree();
    break;

  case "write-tree":
    process.stdout.write(writeTree());
    break;

  case "commit-tree":
    const treeSha = process.argv[3];
    const parent = process.argv[5];
    const message = process.argv[7];
    commitTree(treeSha, parent, message);
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}











