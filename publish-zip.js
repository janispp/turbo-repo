const fs = require('fs');
const archiver = require('archiver');
const path = require("path");

const package = process.argv.slice(2)[1];

const pathToPackage = path.join(__dirname, "apps", package);
const pathToJson = path.join(pathToPackage, "package.json");
const packageJson = require(pathToJson);

const projectName = packageJson.name;

const destinationFolder = path.join(__dirname, "docs");
const versionJsonFullPath = `${path.join(destinationFolder, projectName)}.version.json`;
const changelogFullPath = `${path.join(destinationFolder, projectName)}.changelog.md`;
const zipFileNameFullPath = path.join(destinationFolder,`${projectName}-${packageJson.version}.zip`);

console.log(`Publishing to ${destinationFolder}...`)

// Create version file
fs.writeFileSync(versionJsonFullPath, "{\n" +
    "\t\"name\": \"" + projectName + "\",\n" +
    "\t\"version\": \"" + packageJson.version + "\"\n" +
    "}\n");


// Copy CHANGELOG.md file
fs.copyFileSync(path.join(pathToPackage, "CHANGELOG.md"), changelogFullPath);

// Create zip file
const output = fs.createWriteStream(zipFileNameFullPath);
const archive = archiver('zip', {
    zlib: {level: 9}
});

output.on('close', function () {
    console.log(`${zipFileNameFullPath} created: ${archive.pointer()} bytes`);
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);
archive.directory(destinationFolder, projectName);
return archive.finalize();
