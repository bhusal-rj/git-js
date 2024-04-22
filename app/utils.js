const fs=require('fs')
const path = require('path')
const crypto = require('crypto')
const zlib = require('zlib')

function writeToBlob(file) {
  const fileContent = fs.readFileSync(file, "utf-8");

  //in git blob header is used to indicate the object being stored is blob.
  //which is always in the form of blob content_lenght\x00
  const blobHeader = `blob ${fileContent.length}\x00`;
  const dataToEncrypt = blobHeader + fileContent;

  //find the hash from the data and blob header
  const hashedValue = findHashContent(dataToEncrypt);

  const dirPath = path.join(__dirname, ".git", "objects");
  const dirName = getObjectDirectory(hashedValue);
  const hashedFileName = getObjectFilename(hashedValue);

  const filePath = path.join(dirPath, dirName);
  //store the content
  fs.mkdirSync(path.join(filePath), { recursive: true });
  fs.writeFileSync(
    path.join(filePath, hashedFileName),
    zlib.deflateSync(dataToEncrypt)
  );

  return hashedValue;
}

function getObjectDirectory(objectHash) {
  return objectHash.slice(0, 2);
}

function getObjectFilename(objectHash) {
  return objectHash.slice(2);
}

function findHashContent(fileData) {
  return crypto.createHash("sha1").update(fileData).digest("hex");
}

module.exports={findHashContent,getObjectFilename,getObjectDirectory,writeToBlob}

