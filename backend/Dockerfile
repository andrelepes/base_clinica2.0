FROM node:20

WORKDIR /backend

COPY package.json ./

RUN npm install

COPY . .

# RUN mkdir ./downloads ./uploads

EXPOSE 3001

CMD ["npm", "run", "dev"] 