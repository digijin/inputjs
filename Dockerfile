FROM digijin/node-xvfb-chrome

WORKDIR /opt/app

ADD package.json yarn.lock /opt/app/
RUN yarn
