#!/bin/bash

set -e
set -o pipefail
set -u
set -x

cd "$(dirname "$0")"

date

[ -d build ] && rm -rf build
mkdir -p build/html

(cd lnxterm_web && npm run build)
cp -ar lnxterm_web/dist/* build/html/

(cd lnxterm_api && go build -ldflags="-s -w -extldflags=-static")
cp -a lnxterm_api/lnxterm build/

(cd sql && bash init_db_with_sqlite.sh)
cp -a sql/lnxterm.db build/

tar czf lnxterm.tar.gz build --transform s/^build/lnxterm/

date
