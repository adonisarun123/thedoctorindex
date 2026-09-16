#!/usr/bin/env bash
# Import every CSV that build-import produced, then record the photo candidates.
#
#   scripts/import-harvest.sh [--dry] [--with-drafts]
#
# Rebuilds the CSVs from whatever match-register.ts has resolved so far, then
# imports each one. Re-running is safe and is the intended way to work: the
# importer skips a doctor whose registration is already on file, so each pass
# only adds what the register has newly confirmed since the last one.
#
# `-publish.csv` holds doctors the register placed; `-draft.csv` holds the rest,
# which import unpublished and invisible.
#
# Written for bash 3.2, which is what macOS ships: no associative arrays.
set -uo pipefail
cd "$(dirname "$0")/.."

DRY=""
WITH_DRAFTS=""
for a in "$@"; do
  [ "$a" = "--dry" ] && DRY="--dry"
  [ "$a" = "--with-drafts" ] && WITH_DRAFTS="yes"
done

# Human-readable source names, so every profile says where it came from.
site_name() {
  case "$1" in
    apollo)       echo "hospital:apollo (apollohospitals.com)" ;;
    apollocradle) echo "hospital:apollo-cradle (apollocradle.com)" ;;
    aster)        echo "hospital:aster (asterhospitals.in)" ;;
    bbh)          echo "hospital:bangalore-baptist (bbh.org.in)" ;;
    cloudnine)    echo "hospital:cloudnine (cloudninecare.com)" ;;
    fortis)       echo "hospital:fortis (fortishealthcare.com)" ;;
    hcg)          echo "hospital:hcg (hcgoncology.com)" ;;
    manipal)      echo "hospital:manipal (manipalhospitals.com)" ;;
    motherhood)   echo "hospital:motherhood (motherhoodindia.com)" ;;
    narayana)     echo "hospital:narayana-health (narayanahealth.org)" ;;
    nu)           echo "hospital:nu-hospitals (nuhospitals.com)" ;;
    rainbow)      echo "hospital:rainbow-childrens (rainbowhospitals.in)" ;;
    sagar)        echo "hospital:sagar (sagarhospitals.in)" ;;
    sakra)        echo "hospital:sakra (sakraworldhospital.com)" ;;
    sparsh)       echo "hospital:sparsh (sparshhospital.com)" ;;
    vikram)       echo "hospital:vikram (vikramhospital.com)" ;;
    *)            echo "hospital:$1" ;;
  esac
}

echo "=== rebuilding CSVs from matched.json"
npm run --silent db:build-import || exit 1

for csv in data/private/import/*-publish.csv data/private/import/*-draft.csv; do
  [ -e "$csv" ] || continue
  base=$(basename "$csv" .csv)
  # Drafts only once matching is finished. A doctor imported as a draft today and
  # matched on the register tomorrow would come back as a SECOND, published
  # profile — the importer deduplicates on registration number, and a draft has
  # none. Import each doctor once, in their final state.
  case "$base" in
    *-draft)
      if [ -z "$WITH_DRAFTS" ]; then
        echo "=== $base  (skipped: pass --with-drafts once db:match has finished)"
        continue
      fi
      publish=""
      site=${base%-draft}
      ;;
    *-publish)
      publish="--publish"
      site=${base%-publish}
      ;;
  esac
  name=$(site_name "$site")
  echo
  echo "=== $base  ($name)"
  npm run --silent db:import -- --file "$csv" --source "$name" $publish $DRY 2>&1 | tail -3
done

echo
echo "=== photo candidates"
npm run --silent db:photo-candidates -- $DRY 2>&1 | tail -3
