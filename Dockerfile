FROM node:alpine

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .

ENV PORT=4001
ENV EMAIL=hudyfaismail@gmail.com
ENV PASS=cjxercwuuzjriama
ENV RAZORPAY_ID_KEY="rzp_test_AGAl3sXv1UmAjD"
ENV RAZORPAY_SECRET_KEY="aXyvxZPVxs0Iu5pWfQLsIjom"

CMD ["npm","start"]

