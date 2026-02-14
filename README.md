# StackSaute

A local-first developer tool for setting up production-grade stacks with a single command.

## Features

- **One-command stack setup**: Create React or Next.js projects instantly.
- **Package management**: Automatically installs dependencies using npm, pnpm, or yarn.
- **TypeScript support**: Built-in TypeScript configuration for new projects.
- **Real-time feedback**: Live logs and progress tracking via a web UI.
- **Zero-config**: No complex setup required.

## Installation

```bash
npm install -g stack-saute
```

## Usage

Run the CLI tool with the desired framework and options.

```bash
npx stack-saute
```

### Options

- **Framework**: `react` or `nextjs`
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **TypeScript**: Enable or disable
- **Packages**: List of additional packages to install

### Example

```bash
npx stack-saute --framework react --manager pnpm --typescript --packages "tailwindcss,framer-motion,axios"
```

## License

MIT © [Rudhra Bharathy]