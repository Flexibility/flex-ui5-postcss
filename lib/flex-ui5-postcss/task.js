const { excludeFiles } = require(".");

const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');

const postcssMinify = require('postcss-minify');

const resourceFactory = require("@ui5/fs").resourceFactory;

const fs = require('fs');

module.exports = async function({workspace, dependencies, taskUtil, options}) {
    const oConfig = {
        include: ["**/*.css"],
        exclude: [],
        ...options.configuration
    };

    let aFiles = await workspace.byGlob(oConfig.include);
    aFiles = excludeFiles(aFiles, oConfig.exclude);
    await Promise.all(aFiles.map(async _oFile => {
        let sSrc = await _oFile.getString();

        let oProcResult = await postcss([postcssMinify,autoprefixer, postcssNested]).process(sSrc);

        _oFile.setString(oProcResult.css);
        workspace.write(_oFile);
    }));
};