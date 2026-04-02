---
description: Run PGEU Automation Engine agents for Golaha Guurtida EPD
---

# PGEU Automation Engine Workflow

Runs the PGEU Automation Engine (`pgeu_engine.py`) for the Parliamentary Global Engagement Unit.
Scoped exclusively to Golaha Guurtida / EPD work.

## Prerequisites

Engine must exist at:
```
/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD/pgeu_engine.py
```

## Quick Commands

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py --help
```

## Run All Agents (Deep Sweep)

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py /deep-sweep
```

## Run Individual Agents

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py /audit
```

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py /briefing
```

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py /grant UNDP
```

## Run Slash Commands

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py "/event-prep IPU Istanbul"
```

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py "/pitch-gen EU"
```

```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD"
python3 pgeu_engine.py "/friends-play UK"
```

## Install Cron Scheduler

To run the engine on a schedule (Monday briefings + daily audit):

```bash
bash "/Volumes/MAC DATA/Antigraphity/M2_EPD_MASTER_HUB/03_GOV_CONSULTING/04_GUURTI_FOREIGN_AFFAIRS_EPD/pgeu_cron_setup.sh"
```

## Output Directories

- `LOGS/` — Contribution Logs (Digital Auditor)
- `COMMS/` — Monday Briefings, Event Packages, Bilateral Cables
- `FINANCIALS/` — Concept Notes, Pitch Documents
