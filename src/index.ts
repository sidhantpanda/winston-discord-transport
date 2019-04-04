import Transport, { TransportStreamOptions } from 'winston-transport';
import request from 'request-promise-native';
import os from 'os';

/**
 * Options for Discord transport for winston
 */
interface DiscordTransportOptions extends TransportStreamOptions {
  /** Webhook obtained from Discord */
  webhook: string;
  /** Meta data to be included inside Discord Message */
  defaultMeta: any;
}

/**
 * Nextabit's Discord Transport for winston
 */
export default class DiscordTransport extends Transport {
  /** Webhook obtained from Discord */
  private webhook: string;
  /** Discord webhook id */
  private id: string;
  /** Discord webhook token */
  private token: string;
  private initialized: Promise<void>;
  /** Meta data to be included inside Discord Message */
  private defaultMeta: { [key: string]: string };

  private static COLORS: { [key: string]: number } = {
    error: 14362664, // #db2828
    warn: 16497928, // #fbbd08
    info: 2196944, // #2185d0
    verbose: 6559689, // #6435c9
    debug: 2196944, // #2185d0
    silly: 2210373, // #21ba45
  };

  constructor(opts: DiscordTransportOptions) {
    super(opts);
    this.webhook = opts.webhook;
    this.defaultMeta = opts.defaultMeta;
    this.initialize();
  }

  private getUrl = () => {
    return `https://discordapp.com/api/v6/webhooks/${this.id}/${this.token}`;
  }

  private initialize = () => {
    this.initialized = new Promise(async (resolve, reject) => {
      const opts = {
        url: this.webhook,
        method: 'GET',
        json: true
      };
      try {
        const response = await request(opts);
        this.id = response.id;
        this.token = response.token;
        resolve();
      } catch (err) {
        console.error(`Could not connect to Discord Webhook at ${this.webhook}`);
        reject(err);
      }
    });
  }

  log(info: any, callback: { (): void }) {
    setImmediate(() => {
      this.initialized.then(() => {
        this.sendToDiscord(info);
      }).catch(err => { });
    });

    callback();
  }

  private sendToDiscord = async (info: any) => {
    const postBody = {
      content: undefined as string,
      embeds: [{
        description: info.message,
        color: DiscordTransport.COLORS[info.level],
        fields: [] as any[],
        timestamp: new Date().toISOString(),
      }]
    };

    if (info.level === 'error' && info.error && info.error.stack) {
      postBody.content = '```' + info.error.stack + '```';
    }

    if (this.defaultMeta) {
      for (const key in this.defaultMeta) {
        if (this.defaultMeta.hasOwnProperty(key)) {
          postBody.embeds[0].fields.push({
            name: key,
            value: this.defaultMeta[key]
          });
        }
      }
    }

    postBody.embeds[0].fields.push({
      name: 'Host',
      value: os.hostname()
    });

    const options = {
      url: this.getUrl(),
      method: 'POST',
      json: true,
      body: postBody
    };

    try {
      await request(options);
    } catch (err) {
      console.error('Error sending to discord');
    }
  }
}