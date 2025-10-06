# Shared Package

Common types and enums for the go-electrify-simulator monorepo.

## Usage

This package is used internally by the client and server packages.

### Import in other packages

```typescript
import { EventType } from "@go-electrify/shared";

// Use the enum
socket.emit(EventType.MESSAGE, data);
```

## Exports

- `EventType` - Enum for socket event types
- `MessageData` - Interface for message payloads

## Development

Build the package:

```bash
pnpm build
```

Type-check without emitting:

```bash
pnpm typecheck
```
