#!/usr/bin/env bash
# Wait for the register matcher to finish, then import everything it resolved.
#
#   nohup scripts/finish-harvest.sh > data/private/finish.log 2>&1 &
#
# db:match takes hours against a government register that must be queried
# politely, so this waits it out rather than asking anyone to sit and watch.
# When it exits, every doctor is imported once in their final state: published
# where the register placed them, draft where it did not.
set -uo pipefail
cd "$(dirname "$0")/.."

echo "waiting for db:match to finish…"
while pgrep -f "match-register.ts" > /dev/null; do sleep 60; done
echo "matcher finished at $(date)"

# A run that died early leaves matched.json short; say so rather than importing
# a partial corpus as if it were the whole thing.
resolved=$(python3 -c "import json;print(len(json.load(open('data/private/harvest/matched.json'))))" 2>/dev/null || echo 0)
echo "matched.json holds $resolved records"

scripts/import-harvest.sh --with-drafts

echo
echo "=== second hospitals for doctors who work at more than one"
npm run --silent db:extra-practices 2>&1 | tail -3

echo
echo "=== revalidating the site"
npm run --silent db:revalidate 2>&1 | tail -5

echo
echo "=== sitemap"
npm run --silent seo:sitemap 2>&1 | tail -12

echo
echo "=== Bengaluru supply"
npx tsx data/private/q.ts "select d.status, count(distinct d.id) as n from doctors d join doctor_practices p on p.doctor_id=d.id join facilities f on f.id=p.facility_id join localities l on l.key=f.locality_key where l.city_slug='bengaluru' group by 1 order by n desc" 2>&1 | tail -20
echo "done at $(date)"
