# CSim Project Structure

## Overview

CSim is a simple MonoGame DesktopGL project targeting **.NET 9.0**. It defines a single game class (`Game1`) and a minimal `Program` entry point that starts the game. Content is managed through MonoGame’s content pipeline.

## Top-Level Layout

- [CSim.sln](CSim.sln) – Visual Studio / .NET solution file for the CSim project.
- [README.md](README.md) – Project-level documentation (getting started, notes, etc.).
- [CSim](CSim) – Main game project directory.
  - [.config](CSim/.config) – Local tool configuration (e.g., dotnet tools).
  - [.vscode](CSim/.vscode) – VS Code launch/debug configuration.
  - [CSim.csproj](CSim/CSim.csproj) – C# project file and build configuration.
  - [Program.cs](CSim/Program.cs) – Application entry point; creates and runs `Game1`.
  - [Game1.cs](CSim/Game1.cs) – Core MonoGame `Game` subclass; main game loop.
  - [Content](CSim/Content) – MonoGame content pipeline assets and configuration.
    - [Content.mgcb](CSim/Content/Content.mgcb) – MonoGame content build configuration.
    - [bin](CSim/Content/bin) – Built/processed content output.
    - [obj](CSim/Content/obj) – Intermediate content build artifacts.
  - [app.manifest](CSim/app.manifest) – Windows application manifest (app metadata, DPI, etc.).
  - [Icon.ico](CSim/Icon.ico), [Icon.bmp](CSim/Icon.bmp) – Application icons, embedded as resources.
  - [bin](CSim/bin) – Compiled binaries and runtime files (per configuration/target).
  - [obj](CSim/obj) – Intermediate build artifacts for the C# project.

## Project Definition (CSim.csproj)

- **Target framework**: `net9.0`
- **Output type**: `WinExe` (Windows desktop executable)
- **Manifest/icon**:
  - Uses [app.manifest](CSim/app.manifest)
  - Embeds [Icon.ico](CSim/Icon.ico) and [Icon.bmp](CSim/Icon.bmp) as resources
- **Key NuGet dependencies**:
  - `MonoGame.Framework.DesktopGL` (version `3.8.*`)
  - `MonoGame.Content.Builder.Task` (version `3.8.*`)

## Entry Point (Program.cs)

- Very small bootstrap:
  - Instantiates `CSim.Game1` with `using var game = new CSim.Game1();`
  - Calls `game.Run();` to start the MonoGame loop.

## Core Game Loop (Game1.cs)

- Inherits from `Microsoft.Xna.Framework.Game`.
- **Fields**:
  - `GraphicsDeviceManager _graphics` – Manages graphics device and settings.
  - `SpriteBatch _spriteBatch` – Used for 2D rendering (initialized in `LoadContent`).
- **Constructor**:
  - Creates `GraphicsDeviceManager`.
  - Sets `Content.RootDirectory = "Content"` (matches the `Content` folder).
  - Enables mouse visibility.
- **Lifecycle overrides**:
  - `Initialize()` – Currently calls `base.Initialize()` only; place for game-wide initialization.
  - `LoadContent()` – Creates a `SpriteBatch`; place to load textures, fonts, etc.
  - `Update(GameTime gameTime)` – Handles per-frame logic:
    - Exits the game when the Back button (gamepad) or `Esc` key is pressed.
  - `Draw(GameTime gameTime)` – Clears the screen with `Color.CornflowerBlue` and calls `base.Draw`.

## Build Outputs

- [CSim/bin](CSim/bin)
  - Contains compiled binaries under configuration/TFM, e.g. `Debug/net9.0/`.
  - Includes platform-specific native runtime folders for DesktopGL (runtimes/android-*, linux-*, osx, win-x64, etc.).
- [CSim/obj](CSim/obj)
  - Contains MSBuild intermediates, generated code, and reference assemblies.

## How to Extend

- Add new game logic inside `Game1`:
  - Use `Update` for input handling and game state changes.
  - Use `Draw` with the `_spriteBatch` to render sprites and UI.
- Add assets via the MonoGame content pipeline by editing [Content.mgcb](CSim/Content/Content.mgcb) and rebuilding content.
- Adjust project settings (framework, icons, manifest) via [CSim.csproj](CSim/CSim.csproj).
