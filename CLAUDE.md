# CLAUDE.md

请用中文和我对话

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 仓库概览

这是一个多项目仓库，包含多个独立的应用程序和工具：

- **www/**: 专用于显示www存储桶内容的移动端应用 (基于lincon的简化版本)
- **lincon/**: 用于 Linode 云服务管理的 Vue 3 PWA
- **craw/**: Puppeteer 网页抓取示例和工具  
- **meet/**: Akamai 办公室会议室预订系统
- **paper/**: 学术论文收集和管理系统
- **prfaq/**: 新闻稿/FAQ 生成工具
- **cat/**: TTS（文本转语音）网页应用
- **pic/**: 图像处理和 API 集成工具

## 常用命令

### Node.js 项目 (www/, lincon/, craw/)
```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 生产构建
npm run build

# 类型检查 (TypeScript 项目)
npm run type-check

# 代码检查
npm run lint
```

### www项目专用命令
```bash
# 在www目录下运行
cd www/

# 启动开发服务器 (端口15080)
npm run dev

# 构建并部署到存储桶
npm run build && npm run deploy
```

### Python 项目 (meet/, paper/, prfaq/, pic/)
```bash
# 安装依赖
pip3 install -r requirements.txt

# 运行 Flask 应用
python3 app.py

# 运行后台服务
python3 main_launcher.py
```

## 架构概览

### 前端应用
- **lincon/**: Vue 3 + TypeScript + Vite + Pinia，移动优先设计的 PWA
- **cat/**: HTML5 + 原生 JavaScript，用于 TTS 功能
- **meet/**: HTML5 + CSS3，使用 Flask 后端

### 后端服务
- **meet/**: Python Flask 配合 SQLite 数据库
- **paper/**: 多线程爬虫配合 Flask 监控界面
- **prfaq/**: 基于 Streamlit 的文档生成系统
- **pic/**: 图像处理的 API 集成服务

### 核心技术
- **前端**: Vue 3, TypeScript, HTML5/CSS3, Puppeteer
- **后端**: Python Flask, Streamlit, SQLite 数据库
- **构建工具**: Vite, npm, pip
- **API**: Linode API, 各种 AI/ML API

## 项目专用说明

### lincon/ (Linode PWA)
- 移动优先设计方法，iPhone 框架模拟
- 需要环境变量：`VITE_LINODE_API_TOKEN`，S3 凭证
- 开发服务器运行在 18080 端口
- 通过环境变量自动认证

### craw/ (网页抓取)
- 基于 Puppeteer 的浏览器自动化
- 多个示例文件用于不同用例
- 专注于道德抓取实践

### meet/ (会议室系统)
- Akamai 品牌色彩和设计  
- 员工数据采用 CSV 格式
- SQLite 数据库存储预订信息
- 支持 2 个会议室，有容量限制

### paper/ (学术论文)
- 多线程爬虫系统，具有智能错误恢复
- 在 9999 端口提供网页监控界面
- SQLite 数据库存储论文元数据
- 自动调度和质量控制

### prfaq/ (文档生成)
- 基于 Streamlit 的界面
- 多种生成模式（PR、FAQ、MLP、AAR）
- 使用 SQLite 数据库的用户管理
- AI 服务的 API 密钥管理

## 开发指南

### 文件组织
- 每个项目维护自己的依赖和配置
- 通用模式：Flask 应用使用 `app.py`，Node.js 使用 `package.json`
- 文档文件位于项目根目录

### 数据库管理
- 多个项目使用 SQLite 数据库
- 提供数据库初始化脚本
- 记录常规备份程序

### API 集成
- 使用环境变量存储 API 密钥和凭证
- 实现错误处理和速率限制
- 支持多个 AI/ML 服务提供商

## 服务管理

### 开发服务器
- lincon/: 18080 端口 (Vite 开发服务器)
- meet/: 12080 端口 (Flask)
- paper/: 9999 端口 (Flask 监控)
- prfaq/: Streamlit 默认端口

### 后台服务
- paper/: 带调度器的自动爬虫
- 多个监控和健康检查脚本

## 安全考虑
- 使用环境变量存储敏感凭证
- 源代码中无硬编码的 API 密钥
- 适用时使用用户认证系统
- 生产部署的 HTTPS 配置

## 测试
- Vue 项目：`npm run test:unit` (Vitest)
- Python 项目：存在时使用独立测试文件
- 服务监控的健康检查脚本

## www存储桶项目设计

### 项目目标
基于lincon项目创建一个专注于www存储桶内容显示的简化移动端应用。

### 设计要求
- **单一功能**: 仅显示www存储桶内容，移除其他Linode服务功能
- **移动优化**: 专为手机屏幕优化的UI界面
- **端口配置**: 使用15080端口运行
- **简化架构**: 只保留存储桶相关的组件和服务

### 技术架构
- **前端**: Vue 3 + TypeScript + Vite + Pinia
- **存储服务**: Linode Object Storage (www存储桶)
- **UI框架**: 移动优先设计，使用iPhone框架组件
- **状态管理**: Pinia存储（仅存储桶状态）

### 开发步骤

#### 第一阶段：项目初始化
1. 从lincon项目复制基础结构
2. 清理不需要的组件和依赖
3. 修改端口配置为15080
4. 初始化Git仓库

#### 第二阶段：简化应用结构  
1. 移除实例管理相关组件和路由
2. 移除监控功能组件
3. 保留并优化存储桶相关功能
4. 简化导航结构

#### 第三阶段：存储桶功能开发
1. 增强存储桶内容读取功能
2. 优化文件列表显示界面
3. 添加文件预览功能
4. 实现文件搜索和过滤

#### 第四阶段：移动端UI优化
1. 优化移动端触摸体验
2. 改进文件图标和展示样式
3. 添加下拉刷新功能
4. 优化加载状态显示

#### 第五阶段：部署和测试
1. 配置构建脚本
2. 设置自动部署到存储桶
3. 测试移动端兼容性
4. 推送到GitHub

### 文件结构规划
```
www/
├── src/
│   ├── components/          # 基础组件
│   │   ├── BucketFileList.vue
│   │   ├── FilePreview.vue
│   │   └── MobileLayout.vue
│   ├── views/              # 主要视图
│   │   └── BucketView.vue
│   ├── stores/             # 状态管理
│   │   └── bucket.ts
│   ├── services/           # API服务
│   │   └── bucketService.ts
│   └── main.ts
├── package.json
├── vite.config.ts
└── .env
```

### 环境变量配置
```
VITE_S3_ACCESS_KEY=your_access_key
VITE_S3_SECRET_KEY=your_secret_key
VITE_S3_REGION=ap-south-1
VITE_S3_ENDPOINT=https://ap-south-1.linodeobjects.com
VITE_S3_BUCKET=www
```