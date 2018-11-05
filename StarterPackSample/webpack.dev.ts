import * as merge from 'webpack-merge';
import common from './webpack.common';

module.exports = merge(common, {
    // devServer: {
    //     contentBase: __dirname,
    //     open: true,
    //     publicPath: '/build/dist/'
    // },

    // Enable sourcemaps for debugging webpack's output
    devtool: 'eval-source-map',

    mode: 'development',

    module: {
        rules: [

            // All output '.js' files will have any sourcemaps re-preprocessed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
        ]
    }
});