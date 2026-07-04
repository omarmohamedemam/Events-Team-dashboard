#!/usr/bin/env bash
set -euo pipefail

npm ci
npm run generate
npm run migrate
npm run seed
npm run build
npm run start
