#!/bin/bash

sed -i '1s/^/require(".\/send-mail");\n/' /opt/app-root/src/cloud/main.js
cp -r /opt/app-root/etc/parse/src/cloud/. /opt/app-root/src/cloud
cp /opt/app-root/etc/parse/src/parse-config.js /opt/app-root/src/parse-config.js