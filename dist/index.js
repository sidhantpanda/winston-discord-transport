"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_transport_1 = __importDefault(require("winston-transport"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const os_1 = __importDefault(require("os"));
/**
 * Nextabit's Discord Transport for winston
 */
class DiscordTransport extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
        this.getUrl = () => {
            return `https://discordapp.com/api/v6/webhooks/${this.id}/${this.token}`;
        };
        this.initialize = () => {
            this.initialized = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const opts = {
                    url: this.webhook,
                    method: 'GET',
                    json: true
                };
                try {
                    const response = yield request_promise_native_1.default(opts);
                    this.id = response.id;
                    this.token = response.token;
                    resolve();
                }
                catch (err) {
                    console.error(`Could not connect to Discord Webhook at ${this.webhook}`);
                    reject(err);
                }
            }));
        };
        this.sendToDiscord = (info) => __awaiter(this, void 0, void 0, function* () {
            const postBody = {
                content: undefined,
                embeds: [{
                        description: info.message,
                        color: DiscordTransport.COLORS[info.level],
                        fields: [],
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
                value: os_1.default.hostname()
            });
            const options = {
                url: this.getUrl(),
                method: 'POST',
                json: true,
                body: postBody
            };
            try {
                yield request_promise_native_1.default(options);
            }
            catch (err) {
                console.error('Error sending to discord');
            }
        });
        this.webhook = opts.webhook;
        this.defaultMeta = opts.defaultMeta;
        this.initialize();
    }
    log(info, callback) {
        setImmediate(() => {
            this.initialized.then(() => {
                this.sendToDiscord(info);
            }).catch(err => { });
        });
        callback();
    }
}
DiscordTransport.COLORS = {
    error: 14362664,
    warn: 16497928,
    info: 2196944,
    verbose: 6559689,
    debug: 2196944,
    silly: 2210373,
};
exports.default = DiscordTransport;
//# sourceMappingURL=index.js.map