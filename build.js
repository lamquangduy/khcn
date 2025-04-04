const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const htmlMinifier = require('html-minifier');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

async function minifyFile(inputPath, outputPath, minifier) {
    try {
        const content = await fs.readFile(inputPath, 'utf8');
        const minified = await minifier(content);
        await fs.writeFile(outputPath, minified);
        console.log(`Minified: ${inputPath} -> ${outputPath}`);
    } catch (err) {
        console.error(`Error processing ${inputPath}:`, err);
    }
}

async function minifyHTML(content) {
    return htmlMinifier.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true
    });
}

async function minifyCSS(content) {
    const cleanCSS = new CleanCSS({
        level: 2,
        compatibility: '*'
    });
    return cleanCSS.minify(content).styles;
}

async function minifyJS(content) {
    const result = await minify(content, {
        compress: true,
        mangle: true
    });
    return result.code;
}

async function build() {
    try {
        // Tạo thư mục dist nếu chưa tồn tại
        await fs.mkdir('dist', { recursive: true });

        // Copy và minify HTML files
        const htmlFiles = glob.sync('**/*.html', { ignore: ['node_modules/**', 'dist/**'] });
        for (const file of htmlFiles) {
            const outputPath = path.join('dist', file);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await minifyFile(file, outputPath, minifyHTML);
        }

        // Copy và minify CSS files
        const cssFiles = glob.sync('**/*.css', { ignore: ['node_modules/**', 'dist/**'] });
        for (const file of cssFiles) {
            const outputPath = path.join('dist', file);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await minifyFile(file, outputPath, minifyCSS);
        }

        // Copy và minify JavaScript files
        const jsFiles = glob.sync('**/*.js', { ignore: ['node_modules/**', 'dist/**', 'build.js'] });
        for (const file of jsFiles) {
            const outputPath = path.join('dist', file);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await minifyFile(file, outputPath, minifyJS);
        }

        // Copy các file khác (images, fonts, etc.)
        const otherFiles = glob.sync('**/*.!(html|css|js)', { ignore: ['node_modules/**', 'dist/**'] });
        for (const file of otherFiles) {
            const outputPath = path.join('dist', file);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.copyFile(file, outputPath);
            console.log(`Copied: ${file} -> ${outputPath}`);
        }

        console.log('Build completed successfully!');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

build();