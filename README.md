# GMA (Git Message AI)

[![NPM Version](https://img.shields.io/npm/v/@realdicky/gma-cli)](https://www.npmjs.com/package/@realdicky/gma-cli)
[![Downloads](https://img.shields.io/npm/dm/@realdicky/gma-cli)](https://www.npmjs.com/package/@realdicky/gma-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [中文](#chinese)

**GMA** is an AI-powered CLI tool that automatically generates Conventional Commits messages based on your code changes (`git diff`).

**GMA** 是一个基于 AI 的命令行工具，能够根据您的代码变更（`git diff`）自动生成符合 Conventional Commits 规范的 Git 提交信息。

<h2 id="english">Features</h2>

- 🤖 **AI-Powered**: Generates precise commit messages from code changes.
- 🚀 **One-Click Workflow**: Automatically does `git add -A` -> generate message -> `git commit`.
- 📝 **Interactive**: Review, edit, or cancel before committing.
- ⚡️ **Auto Mode**: Supports `autoCommit` for true zero-click committing.
- 🌐 **Multi-language**: Supports English, Chinese, etc. (Default: Chinese).
- 🔌 **Model Compatible**: Defaults to DeepSeek, compatible with other OpenAI-format APIs.

<h2 id="chinese">功能特性</h2>



- 🤖 **AI 驱动**：根据代码变更自动生成精准的提交信息。
- 🚀 **一键流程**：自动执行 `git add -A` -> 生成信息 -> `git commit`。
- 📝 **交互式体验**：生成后可选择提交、编辑或取消。
- ⚡️ **自动模式**：支持 `autoCommit` 配置，实现真正的零点击提交。
- 🌐 **多语言支持**：支持中文、英文等多种语言（默认中文）。
- 🔌 **模型兼容**：默认支持 DeepSeek，兼容 OpenAI 格式的其他 API。

## 安装

```bash
npm install -g @realdicky/gma-cli
# 注意：包名取决于最终发布的名称，本地开发请使用 npm link
```

## 快速开始

1. **进入您的 Git 项目目录**
2. **运行 GMA**
   
   ```bash
   gma
   ```

## 配置指南

首次使用前，您需要配置 AI 提供商的 API Key。

### 1. 设置 API Key (必填)

```bash
gma config apiKey "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
```

### 2. 设置自动提交 (可选)

如果您希望跳过确认步骤，直接提交：

```bash
# 开启自动提交
gma config autoCommit true

# 或者单次运行使用参数
gma --yes
```

### 3. 其他配置

```bash
# 修改 API 地址 (默认 DeepSeek)
gma config apiEndpoint "https://api.openai.com/v1/chat/completions"

# 修改模型 (默认 deepseek-chat)
gma config model "gpt-4"

# 修改语言 (默认 zh-CN)
gma config language "en-US"
```

## 常见问题

**Q: 遇到 404 错误？**  
A: 请检查 `apiEndpoint` 配置。如果您使用的是 DeepSeek 或 OpenAI，通常不需要手动修改 endpoint，除非使用自定义反代。工具会自动补全 `/chat/completions`。

**Q: 提示 "No changes to commit"？**  
A: 确保您的工作区有修改文件。GMA 会自动执行 `git add -A`，但如果没有文件变动，它将无法生成信息。

## License

MIT

---

## GMM (Git Master Merge / Branch Manager)

`gmm` 是随 `gma` 一起提供的智能分支管理工具，用于规范化、自动化地创建开发分支。

### 核心功能

*   🛡 **安全检查**：如果有未提交更改或未推送的 commit，禁止切换/创建分支，防止代码丢失或冲突。
*   🔄 **自动同步**：自动切换到基础分支（默认 `master`）并拉取最新代码，确保新分支基于最新代码。
*   🌿 **规范命名**：支持自动按日期或 AI 根据描述生成语义化分支名。

### 使用指南

#### 1. 基础创建 (按时间)
默认创建 Feature 分支，后缀为当天日期 (MMDD)。
```bash
gmm
# 示例: feature/1216
```

#### 2. 创建 Hotfix 分支
使用 `-f` 或 `--fix` 参数。
```bash
gmm -f
# 示例: hotfix/1216
```

#### 3. AI 智能命名
使用 `-m` 参数提供描述，AI 将自动生成简短的英文分支名后缀。
```bash
gmm -m "新增用户登录页面"
# AI 分析 -> user-login
# 结果: feature/user-login
```

结合 Hotfix：
```bash
gmm -f -m "修复支付金额计算错误"
# AI 分析 -> fix-payment-calc
# 结果: hotfix/fix-payment-calc
```

### GMM 配置

#### 设置分支前缀
如果您团队有统一的命名规范（如包含个人代号），可以设置前缀。

```bash
gmm config setPrefix tom
```

设置后的效果：
```bash
gmm
# -> feature/tom-1216

gmm -m "订单列表"
# -> feature/tom-order-list
```

#### 设置基础分支
默认基础分支为 `master`。如果您的项目使用 `main` 或其他分支，可以通过 `gma` 配置修改：

```bash
gma config baseBranch main
```

