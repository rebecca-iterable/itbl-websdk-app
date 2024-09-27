const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Rule for CSS files
        use: ['style-loader', 'css-loader'], // Loaders for CSS
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, // Rule for image files
        type: 'asset/resource', // Handles images as assets/resource,
        //loader: 'file-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // Rule for fonts and other assets
        type: 'asset/resource', // Handles fonts as assets/resource
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext]',
    clean: true, // Clean the output directory before emit
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // Output file name
      template: './src/index.html', // Source template
      //chunks: ['index'], // Include only the index entry point
    }),
    new HtmlWebpackPlugin({
      filename: 'workout.html', // Output file name
      template: './src/workout.html', // Source template
    //   chunks: ['workout'], // Include only the workout entry point
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: false, // Automatically open the browser on server start
  },
  mode: 'development',
};
