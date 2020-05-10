import Transport, { TransportStreamOptions } from 'winston-transport';
import request from 'superagent';
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
class DiscordTransport extends Transport {
  /** Webhook obtained from Discord */
  private webhook: string;

  /** Discord webhook id */
  private id: string;

  /** Discord webhook token */
  private token: string;

  /** Initialization promise resolved after retrieving discord id and token */
  private initialized: Promise<void>;

  /** Meta data to be included inside Discord Message */
  private defaultMeta: { [key: string]: string };

  /** Available colors for discord messages */
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

  /** Helper function to retrieve url */
  private getUrl = () => {
    return `https://discordapp.com/api/v6/webhooks/${this.id}/${this.token}`;
  }

  /**
   * Initialize the transport to fetch Discord id and token
   */
  private initialize = () => {
    this.initialized = new Promise((resolve, reject) => {
      const opts = {
        url: this.webhook,
        method: 'GET',
        json: true
      };
      request
        .get(opts.url)
        .set('accept', 'json')
        .then(response => {
          this.id = response.body.id;
          this.token = response.body.token;
          resolve();
        }).catch(err => {
          console.error(`Could not connect to Discord Webhook at ${this.webhook}`);
          reject(err);
        });
    });
  }

  /**
   * Function exposed to winston to be called when logging messages
   * @param info Log message from winston
   * @param callback Callback to winston to complete the log
   */
  log(info: any, callback: { (): void }) {
    if (info.discord !== false) {
      setImmediate(() => {
        this.initialized.then(() => {
          this.sendToDiscord(info);
        }).catch(err => {
          console.log('Error sending message to discord', err);
        });
      });
    }

    callback();
  }

  /**
   * Sends log message to discord
   */
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
      postBody.content = `\`\`\`${info.error.stack}\`\`\``;
    }

    if (this.defaultMeta) {
      Object.keys(this.defaultMeta).forEach(key => {
        postBody.embeds[0].fields.push({
          name: key,
          value: this.defaultMeta[key]
        });
      });
    }

    if (info.meta) {
      Object.keys(info.meta).forEach(key => {
        postBody.embeds[0].fields.push({
          name: key,
          value: info.meta[key]
        });
      });
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
      // await request(options);
      await request
        .post(options.url)
        .send(options.body)
        .set('accept', 'json');
    } catch (err) {
      console.error('Error sending to discord');
    }
  }
}

export = DiscordTransport;