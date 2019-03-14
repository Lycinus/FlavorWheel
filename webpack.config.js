const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  rules: [
    {
      test: [/\.js?$/], 
      exclude: /(node_modules)/, 
      loader: 'babel-loader', 
      query: {
        presets: ['@babel/env', '@babel/react']
      }
    }
  ]
};