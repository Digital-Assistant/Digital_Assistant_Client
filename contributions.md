# Contributing to Digital Assistant

Thank you for considering contributing 🎉!  
This guide explains how to set up your environment, follow conventions, and submit changes.

---

## Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/Digital_Assistant_Client.git
   cd Digital_Assistant_Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the Core SDK**
   ```bash
   cd packages/core
   npm run build
   cd ../..
   ```

---

## Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**  
   - Follow our coding conventions in [conventions.md](conventions.md).
   - Keep changes focused and minimal per PR.

3. **Run tests**
   ```bash
   npm test
   ```

4. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(auth): add JWT-based authentication
   fix(flow): resolve crash in replay mode
   ```

5. **Push and open a Pull Request**
   ```bash
   git push origin feature/my-feature
   ```

---

## Reporting Issues

- Use the [Issues tab](../../issues) to report bugs or request features.
- Include:
  - Steps to reproduce
  - Expected vs actual behavior
  - Logs, screenshots if applicable

---

## Code of Conduct

- Be respectful in all communications.
- Provide constructive feedback during reviews.
- Assume positive intent from other contributors.

---

## Resources

- [agents.md](agents.md) – System agents and architecture  
- [conventions.md](conventions.md) – Coding and repository rules
