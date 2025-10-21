FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install

COPY . .

RUN mkdir -p public && chown -R bun:bun /app

EXPOSE 3000

USER bun

CMD ["bun", "--watch", "server.js"]