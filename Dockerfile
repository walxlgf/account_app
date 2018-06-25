FROM node:9.4.0

ENV APP_HOME /app

COPY package*.json ${APP_HOME}/

WORKDIR $APP_HOME

RUN npm install

# COPY . .

EXPOSE 3000

# CMD ["npm", "start"]
