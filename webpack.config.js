module.exports = {
    entry: [
        './src/index.react.tsx'
    ],
    devtool: 'inline-source-map',
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/env",
                            "@babel/react",
                            "@babel/typescript"
                        ],
                        plugins: [
                          "@babel/plugin-syntax-dynamic-import",
                          "@babel/plugin-proposal-class-properties",
                          "@babel/plugin-proposal-object-rest-spread"
                        ]
                    }
                }
            }
        ]
    },
    output: {
        path: __dirname + '/static',
        filename: 'bundle.js'
    }
};