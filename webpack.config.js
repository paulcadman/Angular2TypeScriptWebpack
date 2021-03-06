const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const execSync = require('child_process').execSync;

const helpers = require('./config/helpers.js');

module.exports = {
    entry: {
        'app': [
            'core-js',
            'zone.js',
            'rxjs',

            './src/main.ts'
        ],
        'spec': [
            'core-js',
            'zone.js',
            'rxjs',

            './src/app/app.component.ts',
            './src/spec.ts'
        ]
    },

    output: {
        path: helpers.root('./cordova/www'),
        filename: '[name].[hash].js'
    },

    resolve: {
        extensions: ['', '.js', '.ts']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ],
        postLoaders: [
            {
                test: /\.ts$/,
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /main.ts/,
                    /spec.ts/,
                    /\.(e2e|spec)\.ts$/,
                    /node_modules/
                ]
            }
        ]
    },

    devtool: 'inline-source-map',

    plugins: [
        new HtmlWebpackPlugin({
            ejs: {
                environment: 'Development'
            },
            template: './src/index.ejs',
            favicon: './src/assets/favicon.ico',
            excludeChunks: ['spec']
        }),

        function ReactOnWebpackWatchRunEventPlugin() {
            this.plugin('run', function (watching, callback) {
                logCurrentDateFormatted();
                npmRun('rimraf -- ./cordova/www/* ./coverage', 'Clean');
                npmRun('lint', 'Lint');
                
                callback();
            });
        },

        function ReactOnWebpackWatchRunEventPlugin() {
            this.plugin('watch-run', function (watching, callback) {
                logCurrentDateFormatted();
                npmRun('rimraf -- ./cordova/www/*.{js,html} ./coverage', 'Clean');
                npmRun('lint', 'Lint');
                
                callback();
            });
        },

        function ReactOnWebpackDoneEventPlugin() {
            this.plugin('done', function () {
                npmRun('cordova build browser', 'Cordova');
                npmRun('karma start', 'Karma');
            });
        }
    ]
};

function npmRun(command, title) {
    execSync('npm run ' + command, {stdio: [process.stdin, process.stdout, process.stderr]});
    console.log('└── \u001b[32;1m' + title + '\u001b[0m');
}

function logCurrentDateFormatted() {
    var currentDate = new Date();
    console.log();
    console.log(
        'Built: '
        + currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear()
        + ' - \u001b[33;1m'
        + currentDate.getHours() + ':' + currentDate.getMinutes() + '.' + currentDate.getSeconds()
        + '\u001b[0m');
}
