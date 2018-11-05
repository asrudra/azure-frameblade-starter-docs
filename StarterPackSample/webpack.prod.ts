import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import common from './webpack.common';

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // tslint:disable-line: no-var-requires , tskubt:disable-line: no-implicit-dependencies

const config: webpack.Configuration = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // new BundleAnalyzerPlugin() // this is to analyze bundle size
    ]
});

export default config;