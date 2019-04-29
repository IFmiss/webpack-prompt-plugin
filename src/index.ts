const os = require('os')
const chalk = require('chalk')
const PLUGIN_NAME = 'webpack-prompt-plugin';

interface Itip {
  name: string
  color?: string
}

interface Ioptions {
  ip: boolean
  tips: Itip[]
}

class WebpackPromptPlugin {
  isWatch = false
  option = {
    ip: true,
    tips: [
      {
        name: '你好',
        color: ''
      }
    ]
  }
  constructor (options: Ioptions) {
    this.option = Object.assign({}, this.option, options)
  }

  getIP = function(): string {
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
  }

  printIP = function(devServer: any): void {
    // 打印返回信息
    if (this.option.ip) {
      const host = devServer.host ? (devServer.host === '0.0.0.0' ? this.getIP() : devServer.host) : 'localhost'
      const port = devServer.port || 80
      const text = `http://${host}:${port}/`
      console.log('\n')
      console.log(chalk.bgGreen.black(' done '), chalk.green('App is runing!'))
      console.log('\n')
      console.log('- Local:  ', chalk.underline.blue(`http://localhost:${port}/`))
      console.log('- Network:', chalk.underline.blue(text))
      console.log('\n')
    }
  }

  printIpHandler = function (compilation: any): void {
    const self = this

    if (compilation.hooks) {
      compilation.hooks.done.tap(PLUGIN_NAME, function() {
        self.isWatch && compilation['options']['devServer'] && self.printIP(compilation['options']['devServer'])
      })
    } else {
      compilation.plugin('done', function(stats: any) {
        self.isWatch && compilation['options']['devServer'] && self.printIP(compilation['options']['devServer'])
      })
    }
  }

  printCustom = function (): void {
    this.option.tips.length && this.option.tips.forEach((item: Itip | string) => {
      if (typeof item === 'string') {
        console.log(chalk.green(item || 'hello webpack-prompt-plugin'))
      }

      if (typeof item === 'object') {
        console.log(chalk[item.color](item.name || 'hello webpack-prompt-plugin'))
      }
    })
  }

  printCustomHandler = function (compilation: any): void {
    const self = this
    if (compilation.hooks) {
      compilation.hooks.done.tap(PLUGIN_NAME, function() {
        self.printCustom()
      })
    } else {
      compilation.plugin('done', function(stats: any) {
        self.printCustom()
      })
    }
  }

  initHandler = function (compilation: any): void {
    const self = this
    if (compilation.hooks) {
      compilation.hooks.watchRun.tap(PLUGIN_NAME, function() {
        self.isWatch = true
      })
      compilation.hooks.failed.tap(PLUGIN_NAME, function() {
        self.isWatch = false
        console.log(chalk.red('failed'))
      })
    } else {
      compilation.plugin('watchRun', function(compiler: any) {
        self.isWatch = true
      })
      compilation.plugin('done', function(stats: any) {
        self.isWatch && compilation['options']['devServer'] && self.printIP(compilation['options']['devServer'])
      })
      compilation.plugin('failed', function () {
        self.isWatch = false
        console.log(chalk.red('failed'))
      })
    }
  }

  apply = function (compilation: any) {
    this.initHandler(compilation)

    this.printIpHandler(compilation)

    this.printCustomHandler(compilation)
  }
}

module.exports = WebpackPromptPlugin
