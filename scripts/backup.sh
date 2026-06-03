#!/bin/sh
set -eu

echo "Starting PostgreSQL backup..."

: "${PGHOST:?Missing PGHOST}"
: "${PGUSER:?Missing PGUSER}"
: "${PGPASSWORD:?Missing PGPASSWORD}"
: "${PGDATABASE:?Missing PGDATABASE}"

: "${S3_ENDPOINT:?Missing S3_ENDPOINT}"
: "${S3_ACCESS_KEY_ID:?Missing S3_ACCESS_KEY_ID}"
: "${S3_SECRET_ACCESS_KEY:?Missing S3_SECRET_ACCESS_KEY}"
: "${S3_BUCKET:?Missing S3_BUCKET}"

TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%SZ")
FILE="/tmp/backup-${PGDATABASE}-${TIMESTAMP}.sql.gz"

mkdir -p /root/.config/rclone

cat > /root/.config/rclone/rclone.conf <<EOF
[s3]
type = s3
provider = Other
access_key_id = $S3_ACCESS_KEY_ID
secret_access_key = $S3_SECRET_ACCESS_KEY
endpoint = $S3_ENDPOINT
region = ${S3_REGION:-us-east-1}
force_path_style = true
EOF

echo "Dumping database: $PGDATABASE"

pg_dump \
  -h "$PGHOST" \
  -U "$PGUSER" \
  "$PGDATABASE" \
| gzip -9 > "$FILE"

echo "Uploading to S3..."

rclone copy "$FILE" "s3:${S3_BUCKET}/" \
  --s3-force-path-style
# echo "Applying retention policy (7 days)..."

# rclone delete "s3:${S3_BUCKET}/backups" \
#   --s3-endpoint "$S3_ENDPOINT" \
#   --s3-force-path-style \
#   --s3-access-key-id "$S3_ACCESS_KEY_ID" \
#   --s3-secret-access-key "$S3_SECRET_ACCESS_KEY" \
#   --min-age 7d

echo "Backup complete."

rm -f "$FILE"
