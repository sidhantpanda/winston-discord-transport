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
    /** Initialization promise resolved after retrieving discord id and token */
    private initialized;
    /** Meta data to be included inside Discord Message */
    private defaultMeta;
    /** Available colors for discord messages */
    private static COLORS;
    constructor(opts: DiscordTransportOptions);
    /** Helper function to retrieve url */
    private getUrl;
    /**
     * Initialize the transport to fetch Discord id and token
     */
    private initialize;
    /**
     * Function exposed to winston to be called when logging messages
     * @param info Log message from winston
     * @param callback Callback to winston to complete the log
     */
    log(info: any, callback: {
        (): void;
    }): void;
    /**
     * Sends log message to discord
     */
    private sendToDiscord;
}
export {};
