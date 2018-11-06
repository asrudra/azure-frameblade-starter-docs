import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import path = require('path');

const config: webpack.Configuration = {

    entry: {
        main: ['./src/index.tsx']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, './build/dist')
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json'],
        plugins: [
            new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
        ]
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true
                },
                test: /\.tsx?$/

            },

            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader'},

            // Styles
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader'},
                    { loader: 'css-loader', options: { sourceMap: true}},
                    { loader: 'sass-loader', options: {sourceMap: true}}]
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module: any) { // tslint:disable-line: no-any
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `npm.${packageName.replace('@', '')}`;
                },
              },
            },
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
        },
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};

export default config;
