const fs = require('fs');
const archiver = require('archiver');

const packageJson = require('./package.json');
const projectName = packageJson.name;
const zipFileName = `${projectName}-${packageJson.version}.zip`;

const output = fs.createWriteStream(zipFileName);
const archive = archiver('zip', {
    zlib: { level: 9 }
});

output.on('close', function () {
    console.log(`${zipFileName} created: ${archive.pointer()} bytes`);
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);
archive.directory('./out', projectName);
return archive.finalize();
