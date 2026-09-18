TERRA-TOUR

## 建设路线

#### 创建项目骨架
```
travelling/
├── index.html
├── explore.html
├── detail.html
├── plan.html
├── favorites.html
├── footprints.html
├── css/
│   ├── base.css
│   ├── common.css
│   └── page/
│       ├── index.css
│       └── destination.css
├── js/
│   ├── dom.js
│   ├── common.js
│   ├── navigation.js
│   └── page/
│       ├── index.js
│       └── explore.js
└── assets/
    └── images/
```
#### 首页index语义结构
```html
header
└── nav
main
├── Hero section
├── 热门景点 section
├── 计划出行 section
└── 足迹 section
footer
├── 关于
└── 联系我们
```
#### 建立CSS设计系统
##### base.css
1. 定义全局变量(define)
2. 基础设置：排版和间距
- 通过修改全局变量实现全栈变化
- 手机宽度下没有横向滚动

#### 首页视觉布局
实现界面布局和跳转设置
共有四个屏：
1. 首页
2. 热门景点
3. 计划出行
4. 足迹预览

#### 公共组件
动态生成随机景点卡片

#### 登录、注册、用户资料

#### 收藏

#### 探索详情页

#### 原位返回