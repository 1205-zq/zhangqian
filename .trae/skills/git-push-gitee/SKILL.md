---
name: git-push-gitee
description: Commit the current project and push to the configured Gitee repository. Use when the user says submit project, 提交项目, push to gitee, 推送到 gitee, git commit, or 提交到 gitee. Requires GITEE_TOKEN and GITEE_USER environment variables to be set in the shell session before executing. Do not use for GitHub or GitLab repos.
---

# Git Push → Gitee

将当前工作目录的改动 commit 并 push 到 Gitee 仓库 `https://gitee.com/neusoft_wangyao_jsj/xyz1.git`。

## 前置条件

执行前必须先在当前 Shell 会话里设置两个环境变量：

```powershell
$env:GITEE_TOKEN = "<your gitee 私人令牌>"
$env:GITEE_USER  = "neusoft_wangyao_jsj"
```

**绝对禁止**将 token 硬编码进 SKILL.md、写入 `git remote set-url`、或在日志里明文回显。
如果检测到 token 已过期（401），停止并提示用户重新生成后再继续。

## 执行流程

按顺序执行，每一步都用 PowerShell 语法（分号 `;` 串联，不要用 `&&`）：

### 1. 检查 git 与环境变量

```powershell
git --version 2>&1
if (-not $env:GITEE_TOKEN) { Write-Error "GITEE_TOKEN 未设置，停止"; return }
if (-not $env:GITEE_USER)  { Write-Error "GITEE_USER 未设置，停止"; return }
```

### 2. 确保是 git 仓库

```powershell
if (-not (Test-Path ".git")) { git init }
git config user.email "trae-agent@local"
git config user.name  "Trae Agent"
```

### 3. 添加并提交

- 如果用户提供了 commit message，使用它；否则默认使用：
  `"chore($(Get-Date -Format yyyyMMdd-HHmm)): auto-commit via skill"`

```powershell
git add -A
git status --short | Out-String -Width 300
git commit -m "<commit-message>"
```

如果没有任何改动，`git commit` 会提示 nothing to commit，此时直接跳到 push。

### 4. 设置远程 origin（使用带凭据的 URL，用完即还原）

```powershell
git remote remove origin 2>$null; git remote add origin "https://$env:GITEE_USER`:$env:GITEE_TOKEN`@gitee.com/neusoft_wangyao_jsj/xyz1.git"
```

### 5. 推送

```powershell
git branch -M main
git push -u origin main
```

#### 非 fast-forward 处理

如果 push 被拒（`fetch first` 或 `rejected`），依次尝试：

```powershell
git pull --rebase origin main
git push -u origin main
```

rebase 过程如果出现冲突，停下来告知用户手动解决，不要自动 `--force`。
仅在用户明确要求覆盖时才使用 `git push --force-with-lease`。

### 6. 收尾：清除远程 URL 里的凭据（防止 .git/config 泄漏 token）

```powershell
git remote set-url origin "https://gitee.com/neusoft_wangyao_jsj/xyz1.git"
git remote -v
```

## 故障速查

| 错误 | 可能原因 | 处理 |
|---|---|---|
| `401 Unauthorized` | token 过期 / scope 不够 | 让用户撤销旧令牌、重新生成（scope: `projects` 或 `repo`），再执行步骤 4 |
| `404 Repository not found` | 仓库路径错 / 令牌账号无权限 | 确认 URL `https://gitee.com/neusoft_wangyao_jsj/xyz1.git` 是否存在，令牌账号是否为该仓库成员 |
| `rejected ... fetch first` | 远程已有提交 | 执行 `git pull --rebase origin main` 后再 push |
| `not a git repository` | cwd 错 | 确认当前目录是目标项目根目录；不要重新 `git init` 制造新 root commit |
| 远程 URL 里还能看到 token | 忘记执行步骤 6 | 立即执行步骤 6，然后到 Gitee 后台撤销旧令牌 |

## 安全红线

1. 不要把 token 写入 `git remote set-url` 以外的任何位置。
2. push 成功后必须执行步骤 6，把 remote URL 还原成不带凭据的版本。
3. 如果任务中途失败（步骤 4 之后、步骤 6 之前），也要先执行步骤 6 再报告失败。
4. 不要在对话里回显 `git remote -v` 的完整 URL；只输出 remote 名称和 host。
