const path = require('path');

module.exports = {
  entry: './initialize.js', // ścieżka do głównego pliku, który importuje inne pliki
  output: {
    filename: 'bundle.js', // nazwa pliku wynikowego
    path: path.resolve(__dirname, 'dist'), // ścieżka docelowa dla pliku wynikowego
  },
  module: {
    rules: [
      {
        test: /\.js$/, // dopasuj pliki z rozszerzeniem .js
        exclude: /node_modules/, // pomijaj pliki z katalogu node_modules
        use: {
          loader: 'babel-loader', // użyj loadera Babel
          options: {
            presets: ['@babel/preset-env'], // ustawienia Babel preset
          },
        },
      },
    ],
  },
};