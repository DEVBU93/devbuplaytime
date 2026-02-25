# Security Policy - DevBuPlaytime

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**DO NOT** open a public GitHub issue for security vulnerabilities.

### How to Report

1. Use GitHub's private vulnerability reporting (Security tab > "Report a vulnerability")
2. Include description, reproduction steps, and potential impact
3. We will acknowledge within 48 hours and provide a fix timeline

### Scope

- Backend API (Node.js + Express + Prisma)
- Frontend web application
- Authentication and session management
- Database access and data handling
- File upload functionality

## Security Best Practices for Contributors

- No hardcoded secrets or credentials in code
- Use `.env` files (never commit them)
- All dependencies are monitored via Dependabot
- Signed commits required
- PRs reviewed before merging to main
- Use helmet, rate-limiting, and input validation
