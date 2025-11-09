#!/bin/bash

set -e
set -o pipefail
set -u
set -x

cd "$(dirname "$0")"

date

rm -f lnxterm.db

sqlite3 lnxterm.db <sqlite/init_ddl.sql
sqlite3 lnxterm.db <sqlite/init_dml.sql

date
