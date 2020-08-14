const webpack = require('webpack');
const Path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: Path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: `${Path.resolve(__dirname, 'dist')}/js`,
        publicPath: `${Path.resolve(__dirname, 'dist')}/js`,
    },
    watch: true,

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },

    // Prod
    // mode: 'production',

    // Dev
    mode: 'development',
    optimization: {
      usedExports: true
    },
    devtool: false,

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new WriteFilePlugin(),
        new CopyWebpackPlugin([
            {
                context: './src/',
                from: 'index.html',
                to: '../'
            }
        ])
    ],

    devServer: {
        contentBase: Path.resolve(__dirname, 'dist'),
        compress: true,
        port: 9595
    }
};
