const os = require('os');
const chalk = require('chalk');
const fs = require('fs');
const PLUGIN_NAME = 'webpack-prompt-plugin';
class WebpackPromptPlugin {
    constructor(options) {
        this.isWatch = false;
        this.option = {
            ip: true,
            tips: []
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
        this.getPackageJson = function () {
            const _packageJson = fs.readFileSync('./package.json');
            return JSON.parse(_packageJson);
        };
        this.printIP = function (devServer) {
            // 打印返回信息
            if (this.option.ip) {
                const host = devServer.host ? (devServer.host === '0.0.0.0' ? this.getIP() : devServer.host) : 'localhost';
                const port = devServer.port || 80;
                const text = `http://${host}:${port}/`;
                console.log(process.env.name);
                console.log('\n');
                console.log(chalk.bgGreen.black(' done '), chalk.green('App is runing!'));
                console.log('\n');
                console.log('- Local:  ', chalk.underline.blue(`http://localhost:${port}/`));
                console.log('- Network:', chalk.underline.blue(text));
                console.log('\n');
            }
        };
        this.printProjectInfo = function () {
            const packageJson = this.getPackageJson();
            console.log('name: ', chalk.underline.green(packageJson.name), '   version: ', chalk.underline.green(packageJson.version));
            console.log('\n');
        };
        this.printHandler = function (compiler) {
            const self = this;
            if (compiler.hooks) {
                compiler.hooks.done.tap(PLUGIN_NAME, function () {
                    self.option.ip && self.isWatch && compiler['options']['devServer'] && self.printIP(compiler['options']['devServer']);
                    self.printProjectInfo();
                    self.printCustom();
                });
            }
            else {
                compiler.plugin('done', function (stats) {
                    self.option.ip && self.isWatch && compiler['options']['devServer'] && self.printIP(compiler['options']['devServer']);
                    self.printProjectInfo();
                    self.printCustom();
                });
            }
        };
        this.printCustom = function () {
            this.option.tips && this.option.tips.length && this.option.tips.forEach((item) => {
                const color = item.color ? item.color : 'green';
                if (typeof item === 'object') {
                    console.log(chalk[color](item.name || `hello ${PLUGIN_NAME}`));
                }
                else {
                    console.log(chalk.green(item || `hello ${PLUGIN_NAME}`));
                }
            });
        };
        this.initHandler = function (compiler) {
            const self = this;
            if (compiler.hooks) {
                compiler.hooks.watchRun.tap(PLUGIN_NAME, function () {
                    self.isWatch = true;
                });
                compiler.hooks.failed.tap(PLUGIN_NAME, function () {
                    self.isWatch = false;
                    console.log(chalk.red('failed'));
                });
            }
            else {
                compiler.plugin('watchRun', function (compiler) {
                    self.isWatch = true;
                });
                compiler.plugin('failed', function () {
                    self.isWatch = false;
                    console.log(chalk.red('failed'));
                });
            }
        };
        this.apply = function (compiler) {
            this.initHandler(compiler);
            this.printHandler(compiler);
        };
        this.option = Object.assign({}, this.option, options);
    }
}
module.exports = WebpackPromptPlugin;
//# sourceMappingURL=index.js.map