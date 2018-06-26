#!/usr/bin/env bash
## This script queries how many times flow error are suppressed in the repository and compare to a threshold.
## The goal is to reduce this threshold over time.

THRESHOLD=$1
MATCHES=$(grep -r --exclude-dir=node_modules '$FlowFixMe' . | wc -l)

if [[ MATCHES -gt THRESHOLD ]]; then
  echo "Too many \$FlowFixMe's found:" ${MATCHES} "please try to reduce this number"
  exit 1
else
  exit 0
fi