#!/usr/bin/env bash

npm run build
version=1.1-SNAPSHOT
docker build -t cs-manager:${version} .
docker tag cs-manager:${version} d.lmjia.cn:5443/cs-manager:${version}
docker push d.lmjia.cn:5443/cs-manager:${version}
