const micromatch = require('micromatch');


let excludeFiles = (files, patterns) => {
    const matchableFiles = files.map(file => file.getPath());
    let matches = micromatch(matchableFiles, patterns);
    return files.filter(file => !matches.includes(file.getPath()));
};

module.exports = {
    excludeFiles
};