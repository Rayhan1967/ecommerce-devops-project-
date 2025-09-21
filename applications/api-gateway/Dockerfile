FROM --platform=linux/amd64 node:18-alpine
WORKDIR /usr/src/app

# Install dependencies manual tanpa package.json
RUN npm init -y
RUN npm install express@4.18.3 http-proxy-middleware@3.0.5 dotenv@17.2.2

# Copy aplikasi
COPY start.js ./

CMD ["node", "start.js"]
