# Agents & Modules Documentation

This document describes the major agents, modules, and their responsibilities in the **Digital Assistant Project**.  
The architecture is divided into three main layers: Core SDK, UI Application, and Backend Services.

---

## 1. Core SDK (`@digital-assistant/core`)
A framework-agnostic TypeScript library that encapsulates all business logic.

### Public API
- `initialize({ token })` – bootstrap the SDK with authentication
- `subscribe(callback)` – subscribe to state changes
- `getFlows`, `saveFlow`, `deleteFlow` – flow management
- Other exposed methods for permissions, recording, replaying, etc.

### Internal Modules
- **API Service Layer**  
  Handles all HTTP requests to backend APIs (Flows, Permissions, Feature Flags, Search, Record, Translate, User, etc.).
- **Redux Store**  
  Centralized state management, slices include:
    - `flowSlice`
    - `userSlice`
    - `recordingSlice`
    - `flagsSlice`
- **DOM Engine**  
  Records and replays user interactions with the target webpage.
- **Speech Engine**  
  Provides speech-to-text and profanity filtering.
- **Feature Flag Management**  
  Fetches and evaluates feature flags for feature toggling.

---

## 2. Consuming UI Application (React)
A lightweight React UI layer that consumes the SDK.

### Components & Views
- **Dashboard** – flow list, search
- **Flow Editor** – edit recorded flows
- **Permissions UI** – manage sharing and permissions
- **Navbar** – language selector and global actions

### Supporting Libraries
- `keycloak-js` – user authentication
- `i18next` – internationalization support

---

## 3. Backend Services
- **Digital Assistant API** – endpoints for flows, permissions, feature flags, storage, etc.
- **Keycloak Server** – authentication and identity management

---

## 4. Interactions
- The **React UI** calls the **SDK methods** to fetch/update data.
- The **SDK** communicates with the **API Server** and **Keycloak**.
- The **DOM Engine** directly interacts with the target web page for record/replay.
