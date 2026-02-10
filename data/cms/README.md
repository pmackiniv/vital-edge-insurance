# CMS Landscape Dataset Contract

## Required file
- `./data/cms/landscape_2026.csv` for the current proof cycle.

## Required columns
- `ZIP`
- `STATE`
- `CONTRACT_ID`
- `PLAN_ID`
- `ORGANIZATION_NAME`

## Operator workflow
1. Run bootstrap (fails fast if dataset is missing):
   - `npm run ops:bootstrap -- --databaseUrl "<DATABASE_URL>" --datasetFile ./data/cms/landscape_2026.csv --datasetVersion 2026.02.01 --planYear 2026`
2. Run proof:
   - `BASE_URL=http://localhost:3000 npm run ops:prove -- --startCmd "<start_cmd>" --restartCmd "<restart_cmd>"`

## Notes
- No ad hoc `/tmp` dataset fallback is allowed in the official proof flow.
- Keep dataset version aligned with `/api/tpmo/status` checks.
