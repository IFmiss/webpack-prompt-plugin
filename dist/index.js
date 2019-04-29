const os = require('os');
const chalk = require('chalk');
const PLUGIN_NAME = 'webpack-prompt-plugin';
class WebpackPromptPlugin {
    constructor(options) {
        this.isWatch = false;
        this.option = {
            ip: true,
            tips: [
                {
                    name: '你好',
                    color: ''
                }
            ]
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
        this.printIpHandler = function (compilation) {
            const self = this;
            if (compilation.hooks) {
                compilation.hooks.done.tap(PLUGIN_NAME, function () {
                    self.isWatch && compilation['options']['devServer'] && self.printIP(compilation['options']['devServer']);
                });
            }
            else {
                compilation.plugin('done', function (stats) {
                    self.isWatch && compilation['options']['devServer'] && self.printIP(compilation['options']['devServer']);
                });
            }
        };
        this.printCustom = function () {
            this.option.tips.length && this.option.tips.forEach((item) => {
                if (typeof item === 'string') {
                    console.log(chalk.green(item || 'hello webpack-prompt-plugin'));
                }
                if (typeof item === 'object') {
                    console.log(chalk[item.color](item.name || 'hello webpack-prompt-plugin'));
                }
            });
        };
        this.printCustomHandler = function (compilation) {
            const self = this;
            if (compilation.hooks) {
                compilation.hooks.done.tap(PLUGIN_NAME, function () {
                    self.printCustom();
                });
            }
            else {
                compilation.plugin('done', function (stats) {
                    self.printCustom();
                });
            }
        };
        this.initHandler = function (compilation) {
            const self = this;
            if (compilation.hooks) {
                compilation.hooks.watchRun.tap(PLUGIN_NAME, function () {
                    self.isWatch = true;
                });
                compilation.hooks.failed.tap(PLUGIN_NAME, function () {
                    self.isWatch = false;
                    console.log(chalk.red('failed'));
                });
            }
            else {
                compilation.plugin('watchRun', function (compiler) {
                    self.isWatch = true;
                });
                compilation.plugin('done', function (stats) {
                    self.isWatch && compilation['options']['devServer'] && self.printIP(compilation['options']['devServer']);
                });
                compilation.plugin('failed', function () {
                    self.isWatch = false;
                    console.log(chalk.red('failed'));
                });
            }
        };
        this.apply = function (compilation) {
            this.initHandler(compilation);
            this.printIpHandler(compilation);
            this.printCustomHandler(compilation);
        };
        this.option = Object.assign({}, this.option, options);
    }
}
module.exports = WebpackPromptPlugin;
//# sourceMappingURL=index.js.map