FROM node:20

WORKDIR /game

COPY Game/package*.json ./
RUN npm install

COPY Game/ ./
COPY Scenarios/ ../Scenarios/

ENV PORT=6767

EXPOSE 6767

CMD ["npm", "start"]