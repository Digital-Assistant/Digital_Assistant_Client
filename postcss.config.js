module.exports = {
    plugins: [
        require('postcss-cssnext')({
            warnForDuplicates: false,
            features: {
                customProperties: false,
            },
        }),
        require('postcss-flexbugs-fixes')(),
        process.env.NODE_ENV === 'production'
            ? require('cssnano')({
                    preset: 'default',
              })
            : '',
    ],
};