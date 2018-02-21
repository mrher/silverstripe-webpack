const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const conf = require("./webpack.configuration");
const isProduction = process.env.NODE_ENV === "production";

const includes = {
    app: path.join(conf.SRC, "js/app.js"),
};

const _getAllFilesFromFolder = function(dir) {
    let filesystem = require("fs");
    let results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir + "/" + file;
        let stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;
};

// add page specific scripts
const pageScripts = _getAllFilesFromFolder(conf.PAGES);
pageScripts.forEach((file) => {
    includes[path.basename(file, ".js")] = file;
});

// add page specific scss
const scssIncludes = _getAllFilesFromFolder(conf.PAGESSCSS);
scssIncludes.forEach((file) => {
    includes[path.basename(file, ".scss")] = file;
});

module.exports = {
    entry: includes,
    devtool: "source-map",
    externals: {
        "jquery": "jQuery",
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        ["es2015", {
                            modules: false
                        }],
                        ["stage-2"]
                    ],
                    plugins: [
                        ["transform-react-jsx"],
                        ["react-hot-loader/babel"],
                    ]
                },
            }
        }, {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.coffee?$/,
            use: 'coffee-loader'
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: "file-loader",
            options: {
                name: "img/[name].[ext]",
            }
        }, {
            test: /\.worker\.js$/,
            use: {
                loader: "worker-loader"
            }
        }]
    },
    resolve: {
        alias: {
            'jquery': require.resolve('jquery'),
            'jQuery': require.resolve('jquery'),
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ["popper.js", "default"],
            Util: "exports-loader?Util!bootstrap/js/dist/util",
            Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
            Button: "exports-loader?Button!bootstrap/js/dist/button",
            Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
            Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
        })
    ],
};