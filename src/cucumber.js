/*
export default {
    default: {
        import: ['features/step_definitions/!**!/!*.ts'], // Use "import" for ES Modules
        paths: ['features/!**!/!*.feature'],             // Feature file path
        format: ['pretty'],                           // Output format
        requireModule: ['ts-node/register'],          // Use ts-node for TypeScript
    },
};
*/
/*module.exports = {
    default: [
        '--require-module ts-node/register',
        '--require ./src/tests/step-definitions/!*.ts',
        '--format @cucumber/html-formatter',
        './src/tests/features/!**!/!*.feature'
    ].join(' ')
};*/

export default {
    default: {
        import: ['features/step_definitions/**/*.ts'], // Use "import" for ES Modules
        paths: ['features/**/*.feature'],             // Feature file path
        format: ['pretty'],                           // Output format
        requireModule: ['ts-node/register'],          // Use ts-node for TypeScript
    },
}

