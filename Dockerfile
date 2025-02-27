FROM node:18-alpine

WORKDIR /app

COPY package.json  yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

ENV PORT 8080

EXPOSE 8080

CMD ["yarn", "dev"]
