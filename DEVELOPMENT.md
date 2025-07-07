# Development Setup

This project is configured with a comprehensive code quality and formatting setup using Husky, Prettier, and ESLint.

## Features

### 🎨 Code Formatting with Prettier

- **Auto-formatting on save** (when using VSCode with recommended extensions)
- **Consistent code style** across the entire project
- **Pre-commit formatting** ensures all committed code is properly formatted

### 🔍 Code Linting with ESLint

- **Next.js optimized rules** for React and TypeScript
- **Automatic unused import removal** via `eslint-plugin-unused-imports`
- **Import organization** with proper grouping and alphabetical sorting
- **TypeScript error detection** and best practices enforcement

### 🪝 Git Hooks with Husky

- **Pre-commit hooks** that run linting and formatting automatically
- **Prevents commits** with linting errors
- **Staged file processing** only formats/lints files you're actually committing

## Available Scripts

```bash
# Development
pnpm dev                 # Start development server with Turbopack

# Code Quality
pnpm lint               # Run ESLint to check for issues
pnpm lint:fix           # Run ESLint and auto-fix issues
pnpm format             # Format all files with Prettier
pnpm format:check       # Check if files are properly formatted

# Build & Deploy
pnpm build              # Build for production
pnpm start              # Start production server
```

## VSCode Integration

### Recommended Extensions

The project includes VSCode extension recommendations in `.vscode/extensions.json`:

- **Prettier** - Code formatter
- **ESLint** - Linting and auto-fixing
- **Tailwind CSS IntelliSense** - Tailwind class completion
- **TypeScript Importer** - Auto import suggestions

### Auto-formatting Setup

The project is configured to:

- ✅ **Format on save** - Prettier formats your code automatically
- ✅ **Organize imports on save** - Unused imports removed, imports sorted
- ✅ **Fix ESLint issues on save** - Auto-fixable linting issues resolved
- ✅ **Add missing imports** - TypeScript auto-imports missing dependencies

## Pre-commit Workflow

When you commit code, the following happens automatically:

1. **Husky** triggers the pre-commit hook
2. **lint-staged** processes only staged files
3. **ESLint** runs with auto-fix on `.js`, `.jsx`, `.ts`, `.tsx` files
4. **Prettier** formats `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.css`, `.md` files
5. If any errors remain, **the commit is blocked**

## Configuration Files

- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to exclude from formatting
- `eslint.config.mjs` - ESLint configuration with custom rules
- `.husky/pre-commit` - Git pre-commit hook
- `.vscode/settings.json` - VSCode editor settings
- `package.json` - Contains `lint-staged` configuration

## Troubleshooting

### Commit Blocked by Pre-commit Hook

If your commit is blocked:

1. Run `pnpm lint:fix` to auto-fix ESLint issues
2. Run `pnpm format` to format all files
3. Manually fix any remaining linting errors
4. Try committing again

### VSCode Not Auto-formatting

1. Install recommended extensions from the popup
2. Reload VSCode window (`Ctrl+Shift+P` → "Developer: Reload Window")
3. Check that Prettier is set as default formatter in VSCode settings

### Import Organization Not Working

- Ensure TypeScript extension is enabled in VSCode
- Check that `source.organizeImports` is enabled in `.vscode/settings.json`
- The feature works on save and during pre-commit hooks
