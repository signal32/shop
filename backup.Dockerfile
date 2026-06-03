FROM postgres:18-alpine

RUN apk add --no-cache \
  rclone \
  gzip \
  bash \
  ca-certificates

RUN mkdir -p /etc/crontabs && \
    cat > /etc/crontabs/root <<'EOF'
0 2 * * * /bin/sh /backup.sh >> /proc/1/fd/1 2>&1
EOF

ENTRYPOINT ["/bin/sh", "-c", "crond -f -l 8"]
