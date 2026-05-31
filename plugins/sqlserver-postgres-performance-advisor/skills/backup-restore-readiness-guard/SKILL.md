---
name: backup-restore-readiness-guard
description: Validates backup age, restore rehearsal age, and RPO readiness.
---

# Backup Restore Readiness Guard

Run:

```bash
node runtime/runTool.js backup_restore_readiness_guard '{"lastBackupAgeHours":30,"lastRestoreTestDays":45,"rpoHours":24}'
```

Returns readiness status, findings, and actions.
