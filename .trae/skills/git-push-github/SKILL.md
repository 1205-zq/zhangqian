---
name: git-push-github
description: Commit the current project and push to a GitHub repository over SSH using the already configured SSH key. Use when the user says submit to github, 提交到 github, push to github, 推送到 github, 上传到 github, or 提交到 github. Requires GITHUB_REPO (owner/repo) to be set, and the SSH public key must already be added to the GitHub account. Do not use for Gitee or GitLab repos.
---

# Git Push → GitHub (SSH)

将当前工作目录的改动 commit 并 push 到 GitHub 仓库，走 SSH 认证（复用本机已配置的密钥，不需要 token）。

## 前置条件

```powershell
$env:GITHUB_REPO = "1205-zq/zhangqian"   # owner/repo 格式
```

本机需已有 SSH 密钥，且公钥已添加到 GitHub 账号：
- 私钥 `$env:USERPROFILE\.ssh\id_ed25519`
- 公钥 `$env:USERPROFILE\.ssh\id_ed25519.pub`

**绝对禁止**在 SKILL.md 或命令里硬编码任何 token；本 skill 全程只用 SSH，不涉及凭据。

## 执行流程

按顺序执行，PowerShell 语法（用 `;` 分隔命令，不要用 `&&`）。

### 1. 检查密钥与网络

```powershell
if (-not (Test-Path "$env:USERPROFILE\.ssh\id_ed25519")) {
  Write-Error "未找到 SSH 私钥，请先生成密钥并添加到 GitHub"; return
}
```

GitHub 的 22 端口在部分网络环境会被封锁。若 `ssh -T git@github.com` 报
`Connection refused`，改用 **443 端口**（`ssh.github.com`）：

```powershell
ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -T -p 443 git@ssh.github.com
```

看到 `Hi <username>! You've successfully authenticated...` 即认证成功
（该命令退出码为 1 属正常，GitHub 不提供 shell）。

### 2. 配置 SSH 走 443（仅当 22 端口不通时）

写入 `$env:USERPROFILE\.ssh\config`（已存在则追加，不要覆盖其他 Host 段）：

```
Host github.com
    HostName ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519
```

**Windows 注意**：该文件必须是 **UTF-8 无 BOM**。用 PowerShell 的 `Add-Content` / `Out-File` 默认会写入 BOM，
ssh 会报 `no argument after keyword "﻿"` 并拒绝所有连接。写入方式：

```powershell
$cfg = "$env:USERPROFILE\.ssh\config"
$raw = [System.IO.File]::ReadAllText($cfg)
$clean = $raw.TrimStart([char]0xFEFF)
[System.IO.File]::WriteAllText($cfg, $clean, (New-Object System.Text.UTF8Encoding($false)))
```

这样 `git@github.com:...` 形式的地址会自动走 443，无需每次带 `-p`。

### 3. 确保是 git 仓库并配置身份

```powershell
if (-not (Test-Path ".git")) { git init }
git config user.email "trae-agent@local"
git config user.name  "Trae Agent"
```

### 4. 提交

- 用户指定 commit message 就用用户的；否则用默认：
  `"chore($(Get-Date -Format yyyyMMdd-HHmm)): auto-commit via skill"`

```powershell
git add -A
git status --short | Out-String -Width 300
git commit -m "<commit-message>"
```

工作区无改动时 `git commit` 会提示 nothing to commit，直接继续 push 即可。

### 5. 设置远程并推送（SSH 地址）

```powershell
git remote remove github 2>$null
git remote add github "git@github.com:$env:GITHUB_REPO.git"
git branch -M main
git push -u github main
```

使用独立的远程名 `github`（而不是 `origin`），这样不会覆盖已有的 Gitee `origin`，两个远端可以共存。
remote URL 是 SSH 形式，本身不含任何凭据，无需还原步骤。

#### 非 fast-forward 处理

```powershell
git pull --rebase github main
git push -u github main
```

出现冲突时停止并告知用户手动解决，不要自动 `--force`。

## 故障速查

| 错误 | 可能原因 | 处理 |
|---|---|---|
| `Connection refused` (port 22) | 22 端口被网络封锁 | 按步骤 2 改走 `ssh.github.com:443` |
| `Permission denied (publickey)` | 公钥未添加到 GitHub / 用了错的密钥 | 让用户把 `id_ed25519.pub` 内容加到 GitHub → Settings → SSH keys |
| `Repository not found` | 仓库名错或无权限 | 核对 `$env:GITHUB_REPO`；确认当前密钥所属账号（`1205-zq`）对该仓库有写权限 |
| `rejected ... fetch first` | 远程已有提交（如 README） | `git pull --rebase origin main` 后再 push |
| `Host key verification failed` | 首次连接未记录主机指纹 | 用 `-o StrictHostKeyChecking=accept-new` 重连一次 |
| `no argument after keyword "﻿"` / `bad configuration options` | ssh config 带 UTF-8 BOM | 按步骤 2 用 `UTF8Encoding($false)` 重写为无 BOM |
| `not a git repository` | cwd 错误 | 确认在项目根目录；不要重复 `git init` |

## 安全红线

1. 只用 SSH，不得在命令里出现 token/password。
2. 私有密钥文件不得读取内容输出、不得复制到工作区、不得提交到仓库。
3. 如果远端 push 失败，不要通过 `--force` 掩盖问题。
