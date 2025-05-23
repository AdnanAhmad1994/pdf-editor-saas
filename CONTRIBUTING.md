# Contributing to PDF Editor SaaS

Thank you for your interest in contributing to PDF Editor SaaS! This document provides guidelines for contributing to the project.

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `development` - Integration branch for features
- `feature/*` - Individual feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `development`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

### Branch Naming Convention
- Features: `feature/add-text-editing`
- Bug fixes: `bugfix/fix-pdf-upload`
- Hotfixes: `hotfix/critical-security-fix`

### Commit Message Format
```
type(scope): brief description

Detailed explanation if needed

- List any breaking changes
- Reference issues: Fixes #123
```

Types: feat, fix, docs, style, refactor, test, chore

### Code Standards
- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript/React
- Write meaningful variable and function names
- Add comments for complex logic
- Include unit tests for new features

### Pull Request Process
1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers
