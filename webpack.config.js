module.exports = {
  entry: {
    index: "./client/index.js"
  },
  output: {
    path: __dirname + '/public/js/',
    filename: "[name].bundle.js"
  },
  watch: true,

  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: [ '.js' ]
  },

  module: {
    loaders: [
	    {
		    test: /\.less$/,
		    use: ["style-loader", "css-loader", "less-loader"]
	    }, {
		    test: /\.js$/,
		    loader: "babel-loader",
		    exclude: [/node_modules/]
	    }, {
		    test: /\.jsx$/,
		    loader: "babel-loader",
		    exclude: [/node_modules/]
	    }
    ]
  }
};
