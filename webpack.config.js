var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, './dist');

var config = {
    entry: './src/ui/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module : {
        rules: [
            {
                test : /\.js?/,
                exclude: /node_modules/,
                loader : 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: require.resolve('react'),
                loader: 'expose-loader?React'
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]  
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()],
    watch: true
};

module.exports = config;