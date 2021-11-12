const { excludeFiles } = require(".");

const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');

const postcssMinify = require('postcss-minify');
// const postcssLess = require('postcss-less');

const resourceFactory = require("@ui5/fs").resourceFactory;

const fs = require('fs');

module.exports = async function({workspace, dependencies, taskUtil, options}) {
    const oConfig = {
        // include: ["**/*.less","**/*.scss","**/*.sass","**/*.css"],
        include: ["**/*.css"],
        exclude: [],
        ...options.configuration
    };

    let aFiles = await workspace.byGlob(oConfig.include);
    aFiles = excludeFiles(aFiles, oConfig.exclude);
    await Promise.all(aFiles.map(async _oFile => {
        let sSrc = await _oFile.getString();

        let oProcResult = await postcss(
                [autoprefixer, postcssMinify,postcssNested],
                // {syntax: postcssLess}
            )
            .process(sSrc);

        let oFileCss = resourceFactory.createResource({
            path: _oFile._path.replace(/\.less$/,".css").replace(/\.scss$/i,".css").replace(/\.sass$/i,".css"),
            string: oProcResult.css
        });
        workspace.write(oFileCss);

        // _oFile.setString(oProcResult.css);
        // _oFile.setPath(_oFile._path.replace(/\.less$/,".css2"),);
        // workspace.write(_oFile);

    }));
};