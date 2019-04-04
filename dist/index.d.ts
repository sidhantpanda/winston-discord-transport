import Transport, { TransportStreamOptions } from 'winston-transport';
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
    private webhook;
    /** Discord webhook id */
    private id;
    /** Discord webhook token */
    private token;
    private initialized;
    /** Meta data to be included inside Discord Message */
    private defaultMeta;
    private static COLORS;
    constructor(opts: DiscordTransportOptions);
    private getUrl;
    private initialize;
    log(info: any, callback: {
        (): void;
    }): void;
    private sendToDiscord;
}
export {};
