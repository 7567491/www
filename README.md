# WWW存储桶查看器

专为移动端设计的Linode Object Storage存储桶文件查看器，基于Vue 3构建的PWA应用。

## 项目特性

- 🚀 **移动优先**: 专为手机屏幕优化，iPhone框架模拟
- 📱 **响应式设计**: 完美适配各种移动设备
- 🔍 **实时搜索**: 快速查找存储桶中的文件
- 📋 **文件管理**: 查看、预览、复制文件URL
- ⚡ **高性能**: Vue 3 + Vite构建，快速加载
- 🎨 **现代UI**: 简洁美观的界面设计

## 快速开始

### 环境要求
- Node.js >= 20.19.0
- npm或yarn

### 安装和运行

1. **进入项目目录**
   ```bash
   cd www/
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   
   编辑`.env`文件，填入您的Linode Object Storage凭证：
   ```env
   VITE_S3_ACCESS_KEY=your_s3_access_key_here
   VITE_S3_SECRET_KEY=your_s3_secret_key_here
   VITE_S3_REGION=ap-south-1
   VITE_S3_ENDPOINT=https://ap-south-1.linodeobjects.com
   VITE_S3_BUCKET=www
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   应用将在 http://localhost:15080 启动

## 项目结构

```
www/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── MobileLayout.vue # iPhone框架布局
│   │   └── BucketFileList.vue # 文件列表组件
│   ├── views/              # 页面视图
│   │   └── BucketView.vue  # 主要视图
│   ├── stores/             # Pinia状态管理
│   │   └── bucket.ts       # 存储桶状态
│   ├── services/           # API服务
│   │   └── bucketService.ts # 存储桶服务
│   └── router/             # 路由配置
├── package.json            # 项目配置
└── vite.config.ts         # Vite配置
```

## 主要功能

### 文件查看
- 📂 浏览存储桶文件和文件夹
- 🔍 实时搜索文件
- 📊 显示文件大小和修改时间
- 🎯 文件类型图标识别

### 文件操作
- 👁️ 新窗口预览文件
- 📋 一键复制文件URL
- 🔄 下拉刷新文件列表
- 📱 触摸优化的交互体验

### 界面特性
- 📱 iPhone框架模拟
- 🌓 自动深色模式适配
- ⚡ 流畅的动画效果
- 🎨 现代化UI设计

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 部署到存储桶
npm run build && npm run deploy
```

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **样式**: 原生CSS3

## 浏览器支持

- iOS Safari 12+
- Chrome 80+
- Firefox 75+
- Edge 80+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！