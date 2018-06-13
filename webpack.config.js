/* global __dirname */

const process = require('process');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

/**
 * The URL of the Jitsi Meet deployment to be proxy to in the context of
 * development with webpack-dev-server.
 */
const devServerProxyTarget
    = process.env.WEBPACK_DEV_SERVER_PROXY_TARGET || 'https://beta.meet.jit.si';

const minimize
    = process.argv.indexOf('-p') !== -1
        || process.argv.indexOf('--optimize-minimize') !== -1;

// eslint-disable-next-line camelcase
const node_modules = `${__dirname}/node_modules/`;
const plugins = [
    new webpack.LoaderOptionsPlugin({
        debug: !minimize,
        minimize
    })
];

if (minimize) {
    // XXX Webpack's command line argument -p is not enough. Further
    // optimizations are made possible by the use of DefinePlugin and NODE_ENV
    // with value 'production'. For example, React takes advantage of these.
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    plugins.push(new UglifyJsPlugin({
        cache: true,
        extractComments: true,
        parallel: true,
        sourceMap: true
    }));
}

// The base Webpack configuration to bundle the JavaScript artifacts of
// jitsi-meet such as app.bundle.js and external_api.js.
const config = {
    devtool: 'source-map',
    module: {
        rules: [ {
            // Transpile ES2015 (aka ES6) to ES5. Accept the JSX syntax by React
            // as well.

            exclude: node_modules, // eslint-disable-line camelcase
            loader: 'babel-loader',
            options: {
                // XXX The require.resolve bellow solves failures to locate the
                // presets when lib-jitsi-meet, for example, is npm linked in
                // jitsi-meet. The require.resolve, of course, mandates the use
                // of the prefix babel-preset- in the preset names.
                presets: [
                    [
                        require.resolve('babel-preset-env'),

                        // Tell babel to avoid compiling imports into CommonJS
                        // so that webpack may do tree shaking.
                        { modules: false }
                    ],
                    require.resolve('babel-preset-react'),
                    require.resolve('babel-preset-stage-1')
                ]
            },
            test: /\.jsx?$/
        }
     ]
    },
    node: {
        // Allow the use of the real filename of the module being executed. By
        // default Webpack does not leak path-related information and provides a
        // value that is a mock (/index.js).
        __filename: true
    },
    output: {
        filename: `[name]${minimize ? '.min' : ''}.js`,
        path: `${__dirname}/build`,
        publicPath: '/libs/',
        sourceMapFilename: `[name].${minimize ? 'min' : 'js'}.map`
    },
    plugins,
    resolve: {
        aliasFields: [
            'browser'
        ],
        extensions: [
            '.web.js',

            // Webpack defaults:
            '.js',
            '.json'
        ]
    }
};

module.exports = [
    Object.assign({}, config, {
        entry: {
                     
            'bundle':
                './src/index.js',
                
            'flacEncodeWorker':
                './src/flac/flacEncodeWorker.js'
        }
    }),


];

