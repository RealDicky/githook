# GMA (Git Message AI)

**GMA** 是一个基于 AI 的命令行工具，能够根据您的代码变更（`git diff`）自动生成符合 Conventional Commits 规范的 Git 提交信息。

## 功能特性

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

ISC
