#!/usr/bin/env bash
## This script queries how many times flow error are suppressed in the repository and compare to a threshold.
## The goal is to reduce this threshold over time.

THRESHOLD=$1
MATCHES=$(grep -r --exclude-dir=node_modules '$FlowFixMe' --include \*.js . | wc -l)

if [[ MATCHES -gt THRESHOLD ]]; then
  echo "Too many \$FlowFixMe's found:" ${MATCHES} "please try to reduce this number"
  exit 1
else
  echo "Currently, this repository has" ${MATCHES} "\$FlowFixMe's" 
  exit 0
fi