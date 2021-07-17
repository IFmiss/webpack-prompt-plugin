"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const tpl_1 = __importDefault(require("./tpl"));
const chalk_1 = __importDefault(require("chalk"));
const ip_1 = __importDefault(require("ip"));
const perf_hooks_1 = require("perf_hooks");
const PLUGIN_NAME = 'webpack-prompt-plugin';
const DEFAULT_OPTIONS = {
    tips: [],
    style: 'default'
};
let t;
module.exports = class WebpackPromptPlugin {
    constructor(options) {
        this.isWatch = false;
        this.isStarted = false;
        this.option = DEFAULT_OPTIONS;
        this.option = Object.assign({}, this.option, options);
    }
    getIP() {
        return ip_1.default.address();
    }
    printIP(devServer) {
        const { option: { style } } = this;
        // 打印返回信息
        const host = devServer.host
            ? devServer.host === '0.0.0.0'
                ? this.getIP()
                : devServer.host
            : 'localhost';
        const port = devServer.port || 8080;
        tpl_1.default[style]({
            host,
            port,
            time: t
        });
    }
    printHandler(compiler) {
        const self = this;
        const { isStarted } = this;
        compiler.hooks.done.tap(PLUGIN_NAME, function () {
            setTimeout(() => {
                var _a;
                if (isStarted)
                    return;
                self.isStarted = true;
                if (self.isWatch) {
                    self.printIP(((_a = compiler === null || compiler === void 0 ? void 0 : compiler.options) === null || _a === void 0 ? void 0 : _a.devServer) || {});
                    self.printCustom();
                }
            });
        });
    }
    printCustom() {
        const { option: { tips } } = this;
        tips === null || tips === void 0 ? void 0 : tips.forEach((item) => {
            var _a, _b;
            const color = typeof item !== 'string' && item.color ? item.color : 'white';
            console.log(chalk_1.default[color]((_b = (_a = item) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (item || '')));
        });
    }
    /**
     * 初始化 event 事件
     */
    initHandler(compiler) {
        const self = this;
        compiler.hooks.watchRun.tap(PLUGIN_NAME, function (c) {
            self.isWatch = true;
        });
        compiler.hooks.failed.tap(PLUGIN_NAME, function () {
            self.isWatch = false;
            console.log(chalk_1.default.red('failed'));
        });
    }
    apply(compiler) {
        t = perf_hooks_1.performance.now();
        this.initHandler(compiler);
        this.printHandler(compiler);
    }
};
