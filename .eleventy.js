module.exports = function(config) {
    config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/robots.txt');
    config.addPassthroughCopy('src/manifest.json');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/**/*.(html|gif|jpg|png|svg|mp4|webm|zip)');

     config.addFilter('addLoadingLazy', (content) => {
        content.replace(/<img(?!.*loading)/g, '<img loading="lazy"');
    });

    const slugify = require('slugify');

    config.addFilter('slug', (input) => {
        const options = {
            replacement: '-',
            remove: /[&,\/+()$~%.'":*?<>{}]/g,
            strict: true,
            lower: true
        };
        return slugify(input, options);
    });

    // Даты

    config.addFilter('ruDate', (value) => {
        return value.toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).replace(' г.', '');
    });

    config.addFilter('shortDate', (value) => {
        return value.toLocaleString('ru', {
            month: 'short',
            day: 'numeric'
        }).replace('.', '');
    });

    config.addFilter('isoDate', (value) => {
        return value.toISOString();
    });

    // Трансформации

    config.addTransform('htmlmin', (content, outputPath) => {
        if(outputPath && outputPath.endsWith('.html')) {
            let htmlmin = require('html-minifier');
            let result = htmlmin.minify(
                content, {
                    removeComments: true,
                    collapseWhitespace: true
                }
            );
            return result;
        }
        return content;
    });

    return {
        dir: {
            input: 'src',
            output: 'dist',
        },
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: [
            'html', 'md', 'njk'
        ],
    };
};
