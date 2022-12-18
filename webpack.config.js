const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const getFilename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

const getBabelUseOptions = (...ext) => {
    const useOpts = {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: [['@babel/plugin-proposal-class-properties']],
            assumptions: {
                setPublicClassFields: false,
            },
        },
    };

    if (ext.length) {
        useOpts.options.presets.push(...ext);
    }

    return useOpts;
};

const styledComponentsOpts = () => {
    const useOpts = getBabelUseOptions();
    useOpts.options.plugins = ['babel-plugin-styled-components'];
    return useOpts;
};

const createAliasPath = (endpoint) => path.resolve(__dirname, `src/${endpoint}/`);

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: getFilename('js'),
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@components': createAliasPath('components'),
            '@config': createAliasPath('config'),
            '@hooks': createAliasPath('hooks'),
            '@img': createAliasPath('img'),
            '@pages': createAliasPath('pages'),
            '@stores': createAliasPath('stores'),
            '@styles': createAliasPath('styles'),
            '@types': createAliasPath('types'),
            '@utils': createAliasPath('utils'),
        },
    },
    mode: 'development',
    devServer: {
        port: 5000,
        historyApiFallback: true,
    },
    devtool: isDev ? 'eval' : 'hidden-source-map',
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: getFilename('css'),
        }),
        new ESLintPlugin(),
        new ForkTsCheckerWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.styles.ts$/i,
                use: styledComponentsOpts(),
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.ts$/i,
                exclude: /node_modules/,
                use: getBabelUseOptions(),
            },
            {
                test: /\.tsx$/i,
                exclude: /node_modules/,
                use: getBabelUseOptions('@babel/preset-react'),
            },
        ],
    },
};
