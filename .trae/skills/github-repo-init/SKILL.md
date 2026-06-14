---
name: "github-repo-init"
description: "Initialize local project as Git repo, create GitHub remote repo, and push code. Invoke when user asks to upload code to GitHub, create a new repo, or push to GitHub."
---

# GitHub Repo Init

Initialize a local project as a Git repository, create a GitHub remote repository, and push all code.

## Prerequisites

1. **Git** must be installed (`git --version`)
2. **GitHub CLI (gh)** must be installed and authenticated
   - If `gh` not found, install it:
     ```powershell
     # Download and extract gh CLI
     Invoke-WebRequest -Uri "https://github.com/cli/cli/releases/download/v2.85.0/gh_2.85.0_windows_amd64.zip" -OutFile "$env:TEMP\gh.zip" -UseBasicParsing
     Expand-Archive -Path "$env:TEMP\gh.zip" -DestinationPath "$env:TEMP\gh" -Force
     New-Item -ItemType Directory -Path "C:\Users\36068\bin" -Force | Out-Null
     # Find and copy gh.exe (directory structure may vary)
     $ghExe = Get-ChildItem "$env:TEMP\gh" -Recurse -Filter "gh.exe" | Select-Object -First 1
     Copy-Item $ghExe.FullName -Destination "C:\Users\36068\bin\gh.exe" -Force
     ```
   - Add to PATH: `$env:PATH = "C:\Users\36068\bin" + [System.IO.Path]::PathSeparator + $env:PATH`
3. **GitHub authentication** — need a Personal Access Token (PAT) with `repo` scope
   - If user provides token, authenticate: `echo "<TOKEN>" | gh auth login --with-token`
   - If `read:org` scope missing, use env var fallback: `$env:GH_TOKEN = "<TOKEN>"`
   - Verify auth: `gh auth status`

## Workflow

### Step 1: Check existing Git state

```powershell
git status
```

If already a Git repo with remote, skip to push. If not initialized, proceed.

### Step 2: Initialize Git repo

```powershell
git init
git branch -M main
```

### Step 3: Ensure .gitignore exists

Check for `.gitignore` in project root. If missing, create a basic one:

```
node_modules/
dist/
.astro/
.env
.DS_Store
*.log
```

### Step 4: Stage and commit

```powershell
git add -A
git commit -m "Initial commit: <project-name>"
```

**Note**: In PowerShell, avoid HEREDOC syntax (`<<'EOF'`). Use simple single-line commit messages.

### Step 5: Create GitHub repository

Gather from user (or infer):
- **Repo name** (default: project directory name)
- **Visibility** (public/private, default: public)
- **Description** (optional)
- **Homepage URL** (optional)

```powershell
$env:GH_TOKEN = "<TOKEN>"
gh repo create <repo-name> --public --description "<desc>" --homepage "<url>"
```

### Step 6: Add remote and push

```powershell
git remote add origin https://github.com/<owner>/<repo-name>.git
git push -u origin main
```

If remote already exists, just push:
```powershell
git push -u origin main
```

**Important**: Do NOT embed the token in the remote URL. After push, reset to clean URL:
```powershell
git remote set-url origin https://github.com/<owner>/<repo-name>.git
```

### Step 7: Verify

```powershell
gh repo view <owner>/<repo-name> --json name,url
```

Confirm the repo URL is accessible.

## PowerShell Quirks

- **No `&&` operator** in older PowerShell — chain commands with `;` or run separately
- **No HEREDOC** — use simple `-m "message"` for git commit
- **`echo "token" | gh auth login --with-token`** works for auth
- Always set `$env:GH_TOKEN` before `gh` commands if token auth is used
- Always prepend PATH if gh installed to custom location

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `gh not recognized` | gh CLI not installed | Download and install gh CLI |
| `missing required scope 'read:org'` | PAT lacks scope | Use `$env:GH_TOKEN` fallback |
| `remote origin already exists` | Remote already configured | `git remote set-url origin <url>` then push |
| `failed to push some refs` | Remote has commits | Pull first or force push if new repo |
| `LF will be replaced by CRLF` | Windows line endings | Warning only, safe to ignore |
