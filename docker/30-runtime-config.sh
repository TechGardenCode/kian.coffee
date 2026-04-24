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

# Extract the Sentry public key from the DSN for the GlitchTip tunnel.
# Sentry's `tunnel` transport omits X-Sentry-Auth (spec says the backend
# reconstructs it from the envelope's embedded DSN), but nginx can't parse
# JSON bodies without lua. Shortcut: pull the key from env, inject it as
# a static X-Sentry-Auth header on every proxied request. The file is
# always written (even empty) so nginx's `include` at config-load time
# doesn't fail when no DSN is set (local dev).
SENTRY_KEY=""
if [ -n "$GLITCHTIP_DSN" ]; then
  # DSN format: https://<public_key>@host/<project_id>
  SENTRY_KEY=$(printf '%s' "$GLITCHTIP_DSN" | sed -n 's|^https\{0,1\}://\([^@]*\)@.*|\1|p')
fi
cat > /tmp/glitchtip-auth.conf <<EOF
proxy_set_header X-Sentry-Auth "Sentry sentry_version=7,sentry_key=${SENTRY_KEY},sentry_client=kian-coffee-tunnel/1.0";
EOF
