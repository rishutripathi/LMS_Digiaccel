FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli
# absolute path
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]