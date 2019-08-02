#!/bin/bash
set -e

git add -A
git reset -- `cat .gittrackignore.txt`

git reset -- src/index.html
git reset -- src/app/app.module.ts
git reset -- src/environments/environment.ts
git reset -- src/environments/environment.prod.ts
