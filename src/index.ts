import Transport, { TransportStreamOptions } from 'winston-transport';
import NodeDiscordLogger from 'node-discord-logger';

/**
 * Options for Discord transport for winston
 */
interface DiscordTransportOptions extends TransportStreamOptions {
  /** Webhook obtained from Discord */
  webhook: string;
  /** Meta data to be included inside Discord Message */
  defaultMeta: any;
  iconUrl?: string;
  serviceName?: string;
}

/**
 * Discord Transport for winston
 */
export default class DiscordTransport extends Transport {
  private discordLogger: NodeDiscordLogger;

  constructor(opts: DiscordTransportOptions, errorHandler?: Function) {
    super(opts);
    this.discordLogger = new NodeDiscordLogger({
      hook: opts.webhook,
      iconUrl: opts.iconUrl,
      serviceName: opts.serviceName,
      defaultMeta: opts.defaultMeta,
      errorHandler: err => {
        if (errorHandler) {
          return errorHandler(err);
        }
        console.error('Error from discord', err);
      }
    });
  }

  /**
   * Function exposed to winston to be called when logging messages
   * @param info Log message from winston
   * @param callback Callback to winston to complete the log
   */
  log(info: any, callback: { (): void }) {
    this.discordLogger.log(info.level, {
      message: info.message,
      error: info.error,
    });
    callback();
  }
}
