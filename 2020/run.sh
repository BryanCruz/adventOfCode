#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
DAY_N=$1
DAY_N_DIR="$BASEDIR/day-$DAY_N"

npx ts-node "$DAY_N_DIR/main.ts"
