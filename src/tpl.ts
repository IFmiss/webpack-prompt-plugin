import chalk from 'chalk';
import { getPkg, time2M } from './utils';

const packageJson = getPkg();
const { name, version } = packageJson;

export type TemplateStyle = 'default' | 'text' | 'table';
type TemplateFnParams = {
  port: number;
  host: string;
  time: number;
  isFirst: boolean;
};
type TemplateMapFn = {
  [k in TemplateStyle]: (params: TemplateFnParams) => void;
};

export const logStartTime = (
  time: number,
  desc = 'Project compiled time:'
): Array<string> => {
  return [desc, ...time2M(time)];
};

export const logQueue = (queue: Array<string | Array<string>>): void => {
  try {
    queue?.forEach((item) =>
      console.log(...(Array.isArray(item) ? item : [item]))
    );
  } catch (e) {
    console.log('error', e);
  }
};

export default {
  default: ({ port, host, time, isFirst }) => {
    const text = `http://${host}:${port}`;
    logQueue([
      '\n',
      [chalk.bgGreen.black(' done '), chalk.green(`App is runing!`)],
      '\n',
      [
        '- Local:  ',
        chalk.underline.blue(`http://localhost:${port}`),
        isFirst ? chalk.gray(' [copied to clipboard]') : ''
      ],
      ['- Network:', chalk.underline.blue(text)],
      '\n',
      [
        'name: ',
        chalk.underline.green(name),
        '   version: ',
        chalk.underline.green(version)
      ],
      '\n',
      logStartTime(time),
      '\n'
    ]);
  },

  text: ({ port, host, time, isFirst }) => {
    const text = `http://${host}:${port}`;
    logQueue([
      '\n',
      ['Compiled Time ⏱:', ...time2M(time)],
      ['- Name: ', chalk.underline.green(name)],
      ['- Version: ', chalk.underline.green(version)],
      [
        `Project is running at `,
        chalk.blue(`http://localhost:${port}`),
        isFirst ? chalk.gray(' [copied to clipboard]') : ''
      ],
      [`Visit on network at `, chalk.blue(text)],
      '\n'
    ]);
  },

  table: ({ port, host, time, isFirst }) => {
    const text = `http://${host}:${port} ${chalk.gray(
      isFirst ? chalk.gray(' [copied to clipboard]') : ''
    )}`;
    console.log('\n');
    console.table([
      {
        name,
        url: text,
        port,
        startTime: `${time2M(time)[0]} ${time2M(time)[1]}`,
        version
      }
    ]);
    console.log('\n');
  }
} as TemplateMapFn;
