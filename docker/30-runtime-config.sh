#!/bin/sh
# Rendered at container start by the nginx-unprivileged entrypoint runner.
# Env vars come from the `kian-coffee-runtime-env` Secret (ExternalSecret
# from Bitwarden); APP_ENV is hardcoded per cluster overlay. Output lands
# in /tmp (an emptyDir in-pod, writable under readOnlyRootFilesystem) and
# is served by nginx via `alias /tmp/runtime-config.js`.
set -eu

: "${OPENPANEL_CLIENT_ID:=}"
: "${GLITCHTIP_DSN:=}"
: "${APP_ENV:=unknown}"

export OPENPANEL_CLIENT_ID GLITCHTIP_DSN APP_ENV

envsubst '${OPENPANEL_CLIENT_ID} ${GLITCHTIP_DSN} ${APP_ENV}' \
  < /etc/nginx/runtime-config.template.js \
  > /tmp/runtime-config.js
