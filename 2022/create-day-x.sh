#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
DAY_N=$1
DAY_N_DIR="$BASEDIR/day-$DAY_N"

mkdir "$DAY_N_DIR" && \
cp $BASEDIR/template/* "$DAY_N_DIR"
code "$DAY_N_DIR"
