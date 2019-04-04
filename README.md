# Winston Discord Transport
A custom winston transport for Discord.

This library serves as a [`Transport`](https://github.com/winstonjs/winston#transports) for [winston](https://github.com/winstonjs/winston), a popular Nodejs logging library.

## Installation
1. Add as a dependency
```
{
  ...
  "dependencies": {
    "winston-discord-transport": "git+ssh://git@git.nextabit.com:nxtbt/winston-discord-transport.git"
  },
  ...
}
```
2. Run `npm install`

## Usage
Include in project and use with [`winston`](https://github.com/winstonjs/winston).

```javascript
import DiscordTransport from 'winston-discord-transport';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new DiscordTransport({
      webhook: 'https:/your/discord/webhook',
      defaultMeta: { service: 'my_node_service' }
    })
  ],
});
```

