#!/usr/bin/env bash
# Import every CSV that build-import produced, then record the photo candidates.
#
#   scripts/import-harvest.sh [--dry]
#
# Rebuilds the CSVs from whatever match-register.ts has resolved so far, then
# imports each one. Re-running is safe and is the intended way to work: the
# importer skips a doctor whose registration is already on file, so each pass
# only adds what the register has newly confirmed since the last one.
#
# `-publish.csv` holds doctors the register placed; `-draft.csv` holds the rest,
# which import unpublished and invisible, to be published by a later pass once
# their number is found.
set -uo pipefail
cd "$(dirname "$0")/.."

DRY=""
[ "${1:-}" = "--dry" ] && DRY="--dry"

# Human-readable source names, so every profile says where it came from.
declare -A SITE=(
  [apollo]="hospital:apollo (apollohospitals.com)"
  [apollocradle]="hospital:apollo-cradle (apollocradle.com)"
  [aster]="hospital:aster (asterhospitals.in)"
  [bbh]="hospital:bangalore-baptist (bbh.org.in)"
  [cloudnine]="hospital:cloudnine (cloudninecare.com)"
  [fortis]="hospital:fortis (fortishealthcare.com)"
  [hcg]="hospital:hcg (hcgoncology.com)"
  [manipal]="hospital:manipal (manipalhospitals.com)"
  [motherhood]="hospital:motherhood (motherhoodindia.com)"
  [narayana]="hospital:narayana-health (narayanahealth.org)"
  [nu]="hospital:nu-hospitals (nuhospitals.com)"
  [rainbow]="hospital:rainbow-childrens (rainbowhospitals.in)"
  [sagar]="hospital:sagar (sagarhospitals.in)"
  [sakra]="hospital:sakra (sakraworldhospital.com)"
  [sparsh]="hospital:sparsh (sparshhospital.com)"
  [vikram]="hospital:vikram (vikramhospital.com)"
)

echo "=== rebuilding CSVs from matched.json"
npm run --silent db:build-import || exit 1

for csv in data/private/import/*-publish.csv data/private/import/*-draft.csv; do
  [ -e "$csv" ] || continue
  base=$(basename "$csv" .csv)
  site=${base%-publish}; site=${site%-draft}
  name=${SITE[$site]:-hospital:$site}
  publish=""
  [[ "$base" == *-publish ]] && publish="--publish"
  echo
  echo "=== $base  ($name)"
  npm run --silent db:import -- --file "$csv" --source "$name" $publish $DRY 2>&1 | tail -3
done

echo
echo "=== photo candidates"
npm run --silent db:photo-candidates -- $DRY 2>&1 | tail -3
