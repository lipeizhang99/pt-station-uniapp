# PT Station App

## 项目简介
PT Station App是一个基于uni-app开发的跨平台应用，主要提供论坛交流、私信、个人中心等功能。项目使用Vue 3开发，支持多端运行。

## 功能模块
- **论坛**：支持按模块（图书、交友、软件、音乐、影视）浏览帖子，支持搜索、发帖、点赞、评论等功能。
- **私信**：用户之间的消息交流功能。
- **个人中心**：用户个人信息管理。

## 技术栈
- 框架：uni-app
- 前端：Vue 3
- 依赖：
  - dayjs：用于时间格式化
  - marked：用于Markdown渲染

## 项目结构
```
pt-station-app/
├── pages/                # 页面文件
│   ├── forum/            # 论坛页面
│   ├── post-detail/      # 帖子详情页面
│   ├── user/             # 个人中心页面
│   ├── message/          # 私信页面
│   └── index/            # 首页
├── static/               # 静态资源
│   ├── logo.png          # 项目logo
│   └── icons/            # 图标资源
├── utils/                # 工具函数
│   ├── request.js        # 请求封装
│   └── time.js           # 时间格式化
├── App.vue               # 全局布局
├── main.js               # 项目入口
├── manifest.json         # 项目配置
├── pages.json            # 页面路由配置
└── uni.scss              # 全局样式变量
```

## 开发环境
- 操作系统：Windows 10
- 开发工具：HBuilderX

## 安装与运行
1. 克隆项目到本地
2. 安装依赖：
   ```bash
   npm install
   ```
3. 运行项目：
   ```bash
   npm run dev
   ```

## 项目特点
- 使用Vue 3的Composition API进行开发
- 支持Markdown渲染
- 响应式设计，适配多端

## 贡献指南
欢迎提交Issue和Pull Request，一起完善项目。

## 许可证
MIT
