const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  output: {
    filename: 'angular-qr-scanner.min.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /jsqrcode-combined\.min/
        ],
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
  externals: [
    'canvas',
    'angular',
    'jsqrcode'
  ],
  devtool: 'source-map',
};
