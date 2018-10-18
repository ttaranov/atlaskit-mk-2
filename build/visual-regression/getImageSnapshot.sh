#!/bin/bash

docker-compose build
IPADDR=`ipconfig getifaddr en0`
echo $IPADDR
# docker run --rm --add-host=testing.local.com:$IPADDR -v `pwd`:`pwd` -w `pwd` -i -t visual-regression_dev bolt
cd ../..
echo `pwd`
docker run --rm --add-host=testing.local.com:$IPADDR -v `pwd`:`pwd` -w `pwd` -i -t visual-regression_dev yarn add puppeteer
docker run --rm --add-host=testing.local.com:$IPADDR -v `pwd`:`pwd` -w `pwd` -i -t visual-regression_dev bolt test:vr:record:snapshot