const fs=require('fs')
const path=require('path')

function createGitDirectory() {
    fs.mkdirSync(path.join(__dirname, ".git"), { recursive: true });
    fs.mkdirSync(path.join(__dirname, ".git", "objects"), { recursive: true });
    fs.mkdirSync(path.join(__dirname, ".git", "refs"), { recursive: true });
  
    fs.writeFileSync(
      path.join(__dirname, ".git", "HEAD"),
      "ref: refs/heads/main\n"
    );
    console.log("Initialized git directory");
  }

module.exports={createGitDirectory}