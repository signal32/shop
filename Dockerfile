FROM node:lts

# Python 3, Wine, and utilities required for sign products
RUN dpkg --add-architecture i386 && apt-get update && apt-get install -y \
    wine \
    wine64 \
    wine32 \
    xvfb \
    wget \
    ca-certificates \
    zip \
    python3 \
    python3-pip \
    libc6:i386 \
    libgcc-s1:i386 \
    libstdc++6:i386 \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

# Compressonator CLI required for sign products
RUN wget -O /tmp/compressonator.deb \
    https://github.com/GPUOpen-Tools/compressonator/releases/download/V4.5.52/compressonatorcli_4.5.52_amd64.deb && \
    apt-get update && \
    apt-get install -y /tmp/compressonator.deb

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
