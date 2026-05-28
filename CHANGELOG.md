# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive design philosophy and aesthetic documentation in `README.md`, detailing the PCB/terminal aesthetic, dynamic 3D swarms, and theme modes.
- Detailed descriptions for all projects in `portfolioData.json`, emphasizing architectural choices, impact metrics, and tech stacks.
- Detailed technical descriptions for certifications in `Skills.jsx`, rendered dynamically within the UI.
- `LICENSE` file (MIT License).
- `CHANGELOG.md` file to track project evolution.

### Changed
- Transitioned core documentation from legacy static HTML setup to reflect the modern React 18, Vite, Three.js (React Three Fiber), and Tailwind CSS stack.
- Updated `server/README.md` to properly document the Express server as an optional deployment path compared to Vercel Serverless Functions.

## [1.0.0] - 2026-05-28
### Added
- Initial modularized React portfolio release.
- Core 3D Particle Engine and PCB Scene implementations (`React Three Fiber`).
- Theming engine allowing dynamic toggling between `tranquil` and default modes.
- Serverless API routes for contact form and health checks.
