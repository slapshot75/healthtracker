#!/usr/bin/env sh
set -e
exec ./node_modules/.bin/http-server . -p 3000 -a 0.0.0.0 -c-1