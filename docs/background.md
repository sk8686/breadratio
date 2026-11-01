# 背景：BreadRatio

给家庭烘焙者的数学工具站。

## 页面

酸种含水率、配方缩放、酵母换算、烘焙百分比等，每页一个计算器 + 说明 + FAQ。

## 产品原则

- 只做静态工具页，默认静态生成
- 每页回答 3 个真实问题
- SEO 与性能优先（Cloudflare Pages 静态缓存）
- 不追求功能数量

## 工程

Astro。测试在 `tests/`（calculator-helpers、calculator-ui）。

线上 breadratio.com。
