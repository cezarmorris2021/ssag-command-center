# SSAG Command Center

## Current status: not ready for customer or business records

The backend currently provides a basic health response. Its deal read, deal write, and statistics routes intentionally return an unavailable response because this repository does not yet have a verified, signed-in, long-term data service.

The current source does not provide a working sign-in, role permissions, or a connected persistent CRM. A health response only confirms the server process answered; it does not confirm that the command center works.

Do not enter real customer, financial, or private business information here. Do not treat this repository as the SSAG system of record.

## What the repository contains

- An Express server with a basic health route
- A limited in-memory compatibility layer that must not be used for real records
- A deployment configuration and documentation

The user interface and complete customer workflow have not been verified from this repository. Any old sample login details in earlier documentation were not proof of a working login and have been removed. Do not reuse the old default password.

## What must be true before this can be called production-ready

- A real sign-in system with owner/admin permissions
- A protected database that keeps records after the service restarts
- Working owner interface connected to that database
- Audit history and backups
- Verified, authorized create/read/update behavior with timestamps and access checks

Use the latest supervisor report and the repository's root `AGENTS.md` before making further changes.
