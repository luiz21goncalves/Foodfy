FROM node:12

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-progress && yarn cache clean
COPY . .

EXPOSE 5000
CMD [ "yarn", "run", "start" ]
