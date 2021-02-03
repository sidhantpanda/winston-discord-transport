<!-- Dependency Status -->
<a href="https://david-dm.org/sidhantpanda/winston-discord-transport">
  <img src="https://david-dm.org/sidhantpanda/winston-discord-transport.svg" alt="Dependency Status" />
</a>
<!-- devDependency Status -->
<a href="https://david-dm.org/sidhantpanda/winston-discord-transport#info=devDependencies">
  <img src="https://david-dm.org/sidhantpanda/winston-discord-transport/dev-status.svg" alt="devDependency Status" />
</a>
<a href="https://travis-ci.org/sidhantpanda/winston-discord-transport">
  <img src="https://travis-ci.org/sidhantpanda/winston-discord-transport.svg?branch=master" alt="Build Status" />
</a>
<a href="https://snyk.io//test/github/sidhantpanda/winston-discord-transport?targetFile=package.json">
  <img src="https://snyk.io//test/github/sidhantpanda/winston-discord-transport/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io//test/github/sidhantpanda/winston-discord-transport?targetFile=package.json" style="max-width:100%;">
</a>

# Winston Discord Transport
A custom winston transport for Discord.

This library serves as a [`Transport`](https://github.com/winstonjs/winston#transports) for [winston](https://github.com/winstonjs/winston), a popular Nodejs logging library.

## Features
1. Sends complete **error stack** to discord (see screenshot below)
2. Color codes messages based on log level. Errors are red!
3. Includes information about host machine to pin point source of message.
4. Add any other meta data you want to see in Discord.

## Installation
```
$ npm i winston-discord-transport
```

## Usage

#### Add as a transport
```javascript
import winston from 'winston';
import DiscordTransport from 'winston-discord-transport';

const logger = winston.createLogger({
  transports: [
    new DiscordTransport({
      webhook: 'https:/your/discord/webhook',
      defaultMeta: { service: 'my_node_service' },
      level: 'warn'
    })
  ],
});

logger.log({
  level: 'error',
  message: 'Error intializing service',
  meta: {
    additionalKey: 'someValue'
  },
  error: new Error()
});
```

#### Selectively skip a particular message from being sent to Discord
There might be some log messages which you might want to raise to a file or console, but not flood your Discord channel.
For such message, just include `discord: false` as a key-value in the log message and the transport will drop the message from being sent to Discord.

```javascript
logger.log({
  level: 'warn',
  message: 'Some warning message to not send to discord',
  discord: false
});
```

#### Optional color configuration
If you are using custom log levels with winston, you can provide a map of levels and colors in the transport options:

```javascript
import winston from 'winston';
import DiscordTransport from 'winston-discord-transport';

const levelColors = {
  emerg: 9315107,
  alert: 14362664,
  crit: 14362664,
  error: 14362664,
  warning: 16497928,
  notice: 6559689,
  info: 2196944,
  debug: 2196944
};

const logger = winston.createLogger({
  transports: [
    new DiscordTransport({
      webhook: 'https:/your/discord/webhook',
      defaultMeta: { service: 'my_node_service' },
      level: 'warn',
      colors: levelColors
    })
  ],
});
```

#### Screenshots
##### Error message
<img src="https://i.ibb.co/nsQR12X/Screenshot-2019-09-18-at-7-04-59-PM.png" alt="Error message screenshot" >

##### Warning message
<img src="https://i.ibb.co/TrFspkw/Screenshot-2019-09-18-at-7-05-30-PM.png" alt="Warning message screenshot" >

##### Info message
<img src="https://i.ibb.co/7ygj3Y9/Screenshot-2019-09-18-at-7-05-24-PM.png" alt="Info message screenshot" >

##### Verbose message
<img src="https://i.ibb.co/55p3tMX/Screenshot-2019-09-18-at-7-05-19-PM.png" alt="Verbose message screenshot" >

##### Debug message
<img src="https://i.ibb.co/8cbfxPP/Screenshot-2019-09-18-at-7-05-13-PM.png" alt="Debug message screenshot" >

##### Silly message
<img src="https://i.ibb.co/ZfrGPbF/Screenshot-2019-09-18-at-7-05-08-PM.png" alt="Silly message screenshot" >
