# Dancol UI Framework - 丹青UI框架

一个淡雅典雅的前端HTML UI框架。

## 🎨 框架特性

- **多主题切换系统**：内置4种精美主题配色，支持动态切换
- **Toast消息系统**：功能完善的消息提示系统，支持多种类型和位置配置
- **响应式设计**：完美适配移动端和桌面端设备
- **轻量高效**：原生HTML、CSS、JavaScript实现，无第三方依赖
- **组件化架构**：模块化设计，易于扩展和维护
- **开发友好**：完整的中文文档，清晰的API设计

[![20250623c808f202506231216313640.png](https://kycloud3.koyoo.cn/20250623c808f202506231216313640.png)](https://kycloud3.koyoo.cn/20250623c808f202506231216313640.png)
[![20250623dc70c202506231216315674.png](https://kycloud3.koyoo.cn/20250623dc70c202506231216315674.png)](https://kycloud3.koyoo.cn/20250623dc70c202506231216315674.png)
[![20250623a407a202506231216314760.png](https://kycloud3.koyoo.cn/20250623a407a202506231216314760.png)](https://kycloud3.koyoo.cn/20250623a407a202506231216314760.png)

## 🚀 快速开始

### 1. 下载框架

```bash
# 克隆项目
git clone https://github.com/3iXi/DancolUI.git

# 或者直接下载ZIP文件
```

### 2. 引入文件

在您的HTML页面中引入必要的CSS和JavaScript文件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的项目</title>
    
    <!-- Dancol CSS -->
    <link rel="stylesheet" href="path/to/css/dancol-core.css">
    <link rel="stylesheet" href="path/to/css/dancol-themes.css">
    <link rel="stylesheet" href="path/to/css/dancol-components.css">
</head>
<body>
    <!-- 您的页面内容 -->
    
    <!-- Dancol JavaScript -->
    <script src="path/to/js/dancol-core.js"></script>
    <script src="path/to/js/dancol-theme.js"></script>
    <script src="path/to/js/dancol-toast.js"></script>
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</body>
</html>
```

### 3. 开始使用

```html
<div class="dancol-container">
    <h1>欢迎使用 Dancol UI</h1>
    <button class="dancol-btn dancol-btn-primary" onclick="showToast()">
        点击显示消息
    </button>
</div>

<script>
function showToast() {
    Dancol.Toast.success('Hello, Dancol UI!');
}
</script>
```


## 🎨 主题系统

Dancol UI 内置了5种主题：

- **淡蓝主题** (`light-blue`)：清新淡雅的蓝色系
- **淡绿主题** (`light-green`)：自然舒适的绿色系
- **米黄主题** (`cream`)：温暖典雅的米黄色系
- **柔和主题** (`warm`)：温暖如阳光的暖色调
- **深色主题** (`dark`)：适合夜晚浏览的深色模式

### 主题切换

```javascript
// 切换到淡绿主题
Dancol.Theme.applyTheme('light-green');

// 获取当前主题
const currentTheme = Dancol.Theme.getCurrentTheme();

// 监听主题变更事件
document.addEventListener('dancol:theme-changed', function(e) {
    console.log('主题已切换为:', e.detail.themeInfo.name);
});
```

## 💬 Toast消息系统

功能完善的消息提示系统，支持多种消息类型和配置选项。

### 基本用法

```javascript
// 显示成功消息
Dancol.Toast.success('操作成功！');

// 显示错误消息
Dancol.Toast.error('发生错误，请重试。');

// 自定义配置
Dancol.Toast.show('info', '自定义消息', {
    position: 'top-center',
    duration: 5000,
    closable: true
});

// 简洁样式Toast（背景色铺满，无标题）
Dancol.Toast.simpleSuccess('操作成功！');
Dancol.Toast.simpleError('发生错误');

// 使用show方法创建简洁Toast
Dancol.Toast.show('info', '简洁信息', {
    style: 'simple',
    position: 'top-center'
});
```

### 支持的消息类型

- `success` - 成功消息
- `warning` - 警告消息
- `error` - 错误消息
- `info` - 信息消息

### 支持的位置

- `top-right` - 右上角（默认）
- `top-left` - 左上角
- `top-center` - 顶部中央
- `bottom-right` - 右下角
- `bottom-left` - 左下角
- `bottom-center` - 底部中央

## 🧩 组件系统

### 按钮组件

```html
<button class="dancol-btn dancol-btn-primary">主要按钮</button>
<button class="dancol-btn dancol-btn-secondary">次要按钮</button>
<button class="dancol-btn dancol-btn-outline">轮廓按钮</button>
```

### 卡片组件

```html
<div class="dancol-card">
    <div class="dancol-card-header">
        <h5 class="dancol-card-title">卡片标题</h5>
    </div>
    <div class="dancol-card-body">
        <p class="dancol-card-text">卡片内容</p>
    </div>
</div>
```

### 表单组件

```html
<div class="dancol-form-group">
    <label class="dancol-form-label">用户名</label>
    <input type="text" class="dancol-form-control" placeholder="请输入用户名">
</div>
```

## 📱 响应式布局

### 容器系统

```html
<div class="dancol-container">固定宽度容器</div>
<div class="dancol-container-fluid">全宽容器</div>
```

### 网格系统

```html
<div class="dancol-row">
    <div class="dancol-col-6">6列宽度</div>
    <div class="dancol-col-6">6列宽度</div>
</div>
```

## 🛠️ 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

**Dancol UI Framework** - 让您的Web应用更加淡雅典雅 ✨
