/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: "./src/app.tsx",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "app.js"
    },
    devServer: {
        devMiddleware: {
            index: false,
            publicPath: "/app/js/"
        },
        port: 12465,
        proxy: {
            "/": {
                target: "http://127.0.0.1:12464/"
            }
        },
        static: false
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"]
    },
    plugins: [
        new webpack.ProgressPlugin({
            activeModules: true,
            entries: true,
            modules: true,
            dependencies: true
        }),
        // new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)()
    ],
    module: {
        rules: [
            {
                test: /\.(txt|svg)$/,
                use: ["text-loader"],
                exclude: path.resolve("./static")
            },
            {
                test: /\.tsx?$/,
                use: ["ts-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.jsx?$/
            }
        ]
    }
};
