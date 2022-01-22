/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/** @type {any[]} */
const plugins = [
    new webpack.ids.HashedModuleIdsPlugin()
];

if (process.env.HEADLESS !== "true") {
    plugins.push(new webpack.ProgressPlugin({
        activeModules: true,
        entries: true,
        modules: true,
        dependencies: true
    }));
}

if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: path.resolve(__dirname, "src", "app.tsx"),
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js"
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 1024,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName =
                            module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                .replace("@", "");

                        if (packageName.startsWith("react"))
                            return "pkg.react";
                        else if (packageName.startsWith("bootstrap"))
                            return "pkg.bootstrap";
                        else
                            return "pkg.misc";
                    },
                },
            },
        }
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
    plugins: plugins,
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
