#!/bin/sh
set -eu

: "${OPENPANEL_CLIENT_ID:=}"
: "${GLITCHTIP_DSN:=}"
: "${APP_ENV:=unknown}"

export OPENPANEL_CLIENT_ID GLITCHTIP_DSN APP_ENV

envsubst '${OPENPANEL_CLIENT_ID} ${GLITCHTIP_DSN} ${APP_ENV}' \
  < /etc/nginx/runtime-config.template.js \
  > /tmp/runtime-config.js

glitchtip_public_key=""
if [ -n "$GLITCHTIP_DSN" ]; then
  glitchtip_public_key=$(printf '%s' "$GLITCHTIP_DSN" | sed -n 's|^https\{0,1\}://\([^@]*\)@.*|\1|p')
fi

# Sentry's tunnel transport strips X-Sentry-Auth on the wire; GlitchTip
# returns 403 without it, so nginx re-injects it via this generated snippet.
printf 'proxy_set_header X-Sentry-Auth "Sentry sentry_version=7,sentry_key=%s,sentry_client=kian-coffee-tunnel/1.0";\n' \
  "$glitchtip_public_key" > /tmp/glitchtip-auth.conf
