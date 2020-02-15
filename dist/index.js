var os = require('os');
var chalk = require('chalk');
var fs = require('fs');
var PLUGIN_NAME = 'webpack-prompt-plugin';
var WebpackPromptPlugin = /** @class */ (function () {
    function WebpackPromptPlugin(options) {
        this.isWatch = false;
        this.isStarted = false;
        this.option = {
            ip: true,
            tips: []
        };
        this.getIP = function () {
            var localIPAddress = "";
            var interfaces = os.networkInterfaces();
            for (var devName in interfaces) {
                var iface = interfaces[devName];
                for (var i = 0; i < iface.length; i++) {
                    var alias = iface[i];
                    if (alias.family === 'IPv4' &&
                        alias.address !== '127.0.0.1' &&
                        !alias.internal &&
                        alias.mac !== '00:00:00:00:00:00') {
                        localIPAddress = alias.address;
                    }
                }
            }
            return localIPAddress;
        };
        this.getPackageJson = function () {
            var _packageJson = fs.readFileSync('./package.json');
            return JSON.parse(_packageJson);
        };
        this.printIP = function (devServer) {
            // 打印返回信息
            if (this.option.ip) {
                var host = devServer.host ? (devServer.host === '0.0.0.0' ? this.getIP() : devServer.host) : 'localhost';
                var port = devServer.port || 80;
                var text = "http://" + host + ":" + port + "/";
                console.log('\n');
                console.log(chalk.bgGreen.black(' done '), chalk.green('App is runing!'));
                console.log('\n');
                console.log('- Local:  ', chalk.underline.blue("http://localhost:" + port + "/"));
                console.log('- Network:', chalk.underline.blue(text));
                console.log('\n');
            }
        };
        this.printProjectInfo = function () {
            var packageJson = this.getPackageJson();
            console.log('name: ', chalk.underline.green(packageJson.name), '   version: ', chalk.underline.green(packageJson.version));
            console.log('\n');
        };
        this.printHandler = function (compiler) {
            var self = this;
            if (compiler.hooks) {
                compiler.hooks.done.tap(PLUGIN_NAME, function () {
                    if (self.isStarted)
                        return;
                    self.isStarted = true;
                    self.option.ip && self.isWatch && compiler['options']['devServer'] && self.printIP(compiler['options']['devServer']);
                    self.printProjectInfo();
                    self.printCustom();
                });
            }
            else {
                compiler.plugin('done', function (stats) {
                    if (self.isStarted)
                        return;
                    self.isStarted = true;
                    self.option.ip && self.isWatch && compiler['options']['devServer'] && self.printIP(compiler['options']['devServer']);
                    self.printProjectInfo();
                    self.printCustom();
                });
            }
        };
        this.printCustom = function () {
            this.option.tips && this.option.tips.length && this.option.tips.forEach(function (item) {
                var color = item.color ? item.color : 'green';
                if (typeof item === 'object') {
                    console.log(chalk[color](item.name || "hello " + PLUGIN_NAME));
                }
                else {
                    console.log(chalk.green(item || "hello " + PLUGIN_NAME));
                }
            });
        };
        this.initHandler = function (compiler) {
            var self = this;
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
    return WebpackPromptPlugin;
}());
module.exports = WebpackPromptPlugin;
//# sourceMappingURL=index.js.map