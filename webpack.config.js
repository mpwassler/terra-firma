const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
entry: './index.js',
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
},
devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    open: true,
    openPage: '', // <== Add this
},
plugins: [
    new HtmlWebpackPlugin({
       filename: 'index.html',
       template: './src/index.html'
    })
],
module: {
    rules: [
        {
            test: /\.js$/, //using regex to tell babel exactly what files to transcompile
            exclude: /node_modules/, // files to be ignored
            use: {
                loader: 'babel-loader' // specify the loader
            }
        }
    ]
}
}
