
// export const plugins = [
//     new MiniCssExtractPlugin({
//         filename: "[name].css",
//         chunkFilename: "[id].css",
//     }),
// ];
// export const modules = {
//     rules: [
//         {
//             test: /\.css$/i,
//             use: [MiniCssExtractPlugin.loader, "css-loader"],
//         },
//     ],
// };
// export const optimization = {
//     minimizer: [
//         new CssMinimizerPlugin(),
//     ],
// };

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
});



