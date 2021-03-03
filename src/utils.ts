const fs = require('fs');
const chalk = require('chalk');
const detect = require('detect-port');

export function getPkg() {
  const pkg = fs.readFileSync('package.json');
  return JSON.parse(pkg);
};

export function checkPortTips (port: string | number, compiler: any): Promise<any> {
  return new Promise((resolve, reject) => {
    detect(port, (err, _port) => {
      if (err) {
        console.error('err: ', err);
        reject(err);
      }
  
      // 冲突
      if (port != _port) {
        console.info(`\n`);
        console.info(`\n`);
        console.info(chalk.yellow(`[提示]: ${port} 端口被占用了，为您切换至 ${_port} (${port} port is occupied, switch to ${_port} for you)`));
        console.info(`\n`);
        compiler.options.devServer.port = _port;
      }
      resolve(_port);
    });
  })
};
