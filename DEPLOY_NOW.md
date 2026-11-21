# SSAG Command Center: deployment status

## Do not use this as a live CRM yet

The current backend source deliberately disables deal reads, deal writes, and deal statistics. It has no verified sign-in, role checks, or durable database connection. A server status response is not proof that the CRM works.

The old guide contained a default sample password. That text has been removed; it must not be used or reused.

## What is safe to check

- The service process can answer its health route.
- The health route reports that its memory-only data is not durable.
- The deal routes return an unavailable response until a protected, persistent system is built and verified.

## Requirements before live use

1. Build and connect an owner interface to the correct data service.
2. Add working sign-in and owner/admin access checks.
3. Connect durable storage and backups.
4. Keep secrets in the hosting provider's secret settings, never in page code or public documentation.
5. Confirm one authorized record can be created, read back after a restart, and seen only by the correct account.
6. Review the service logs and alerts for failures.

The deployment file alone does not prove these requirements are met. Keep real customer and financial records out of this service until each item has evidence.
