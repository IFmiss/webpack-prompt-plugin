const os = require('os');
const chalk = require('chalk');
const PLUGIN_NAME = 'webpack-prompt-plugin';
class WebpackPromptPlugin {
    constructor(options) {
        this.option = {
            ip: true
        };
        this.getIP = function () {
            let localIPAddress = "";
            let interfaces = os.networkInterfaces();
            for (let devName in interfaces) {
                let iface = interfaces[devName];
                for (let i = 0; i < iface.length; i++) {
                    let alias = iface[i];
                    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                        localIPAddress = alias.address;
                    }
                }
            }
            return localIPAddress;
        };
        this.printIP = function (devServer) {
            // 打印返回信息
            if (this.option.ip) {
                const host = devServer.host ? (devServer.host === '0.0.0.0' ? this.getIP() : devServer.host) : 'localhost';
                const port = devServer.port || 80;
                const text = `http://${host}:${port}/`;
                console.log('\n');
                console.log(chalk.bgGreen.black(' done '), chalk.green('App is runing!'));
                console.log('\n');
                console.log('- Local:  ', chalk.underline.blue(`http://localhost:${port}/`));
                console.log('- Network:', chalk.underline.blue(text));
                console.log('\n');
            }
        };
        this.apply = function (compilation) {
            const self = this;
            let isWatch = false;
            if (compilation.hooks) {
                compilation.hooks.watchRun.tap(PLUGIN_NAME, function () {
                    isWatch = true;
                });
                compilation.hooks.done.tap(PLUGIN_NAME, function () {
                    if (isWatch) {
                        self.printIP(compilation['options']['devServer']);
                    }
                });
                compilation.hooks.failed.tap(PLUGIN_NAME, function () {
                    isWatch = false;
                    console.log(chalk.red('failed'));
                });
            }
            else {
                compilation.plugin('watchRun', function (compiler) {
                    isWatch = true;
                });
                compilation.plugin('done', function (stats) {
                    if (isWatch) {
                        self.printIP(compilation['options']['devServer']);
                    }
                });
                compilation.plugin('failed', function () {
                    isWatch = false;
                    console.log(chalk.red('failed'));
                });
            }
        };
        this.option = Object.assign({}, this.option, options);
    }
}
module.exports = WebpackPromptPlugin;
//# sourceMappingURL=index.js.map