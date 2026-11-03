/**
 * ============================================================
 * 学生成绩分析面板 —— 数据源
 * 高级网页设计课堂实践任务
 * ------------------------------------------------------------
 * 说明：
 *   - 该文件提供原始数据 STUDENTS 与科目配置 SUBJECTS
 *   - 学生需在 starter.html 中通过 DOM 查找 + 数组方法 + 函数
 *     将这些数据渲染到页面上，达到与 target.html 一比一还原
 * ============================================================
 */

/**
 * 科目配置
 * @property {string} key   - 数据字段名
 * @property {string} name  - 科目显示名
 * @property {string} abbr - 科目缩写（用于卡片上的成绩标签）
 * @property {number} full  - 满分值
 */
const SUBJECTS = [
  { key: "chinese", name: "语文",     abbr: "语", full: 100 },
  { key: "math",    name: "数学",     abbr: "数", full: 100 },
  { key: "english", name: "英语",     abbr: "英", full: 100 },
  { key: "web",     name: "网页设计", abbr: "页", full: 100 },
  { key: "database",name: "数据库",   abbr: "库", full: 100 }
];

/**
 * 班级学生成绩原始数据
 * 每条记录：学号、姓名、性别、各科分数
 * 备注：数据已刻意设计，覆盖以下场景：
 *   - 存在不及格科目（<60）：刘子涵(语58)、孙博文(数55)、黄宇轩(英58)
 *   - 存在满分：周诗涵(语100)
 *   - 优秀学生（平均≥85）：陈雨桐、赵欣怡、周诗涵、林晓彤、罗子睿、唐梓涵、许若曦
 *   - 各科状元互有差异，便于 sort/reduce/find 展示
 */
const STUDENTS = [
  { id: "2024001", name: "张明轩", gender: "男", chinese: 88, math: 95, english: 82, web: 96, database: 90 },
  { id: "2024002", name: "李思琪", gender: "女", chinese: 92, math: 78, english: 90, web: 88, database: 85 },
  { id: "2024003", name: "王浩然", gender: "男", chinese: 75, math: 88, english: 79, web: 92, database: 86 },
  { id: "2024004", name: "陈雨桐", gender: "女", chinese: 95, math: 98, english: 96, web: 94, database: 92 },
  { id: "2024005", name: "刘子涵", gender: "男", chinese: 58, math: 65, english: 72, web: 80, database: 68 },
  { id: "2024006", name: "赵欣怡", gender: "女", chinese: 86, math: 90, english: 88, web: 95, database: 91 },
  { id: "2024007", name: "孙博文", gender: "男", chinese: 70, math: 55, english: 68, web: 75, database: 60 },
  { id: "2024008", name: "周诗涵", gender: "女", chinese: 100, math: 95, english: 98, web: 97, database: 99 },
  { id: "2024009", name: "吴俊杰", gender: "男", chinese: 82, math: 86, english: 75, web: 88, database: 80 },
  { id: "2024010", name: "郑雅文", gender: "女", chinese: 78, math: 92, english: 85, web: 90, database: 88 },
  { id: "2024011", name: "黄宇轩", gender: "男", chinese: 65, math: 70, english: 58, web: 72, database: 68 },
  { id: "2024012", name: "林晓彤", gender: "女", chinese: 90, math: 85, english: 92, web: 88, database: 94 },
  { id: "2024013", name: "高志远", gender: "男", chinese: 88, math: 92, english: 80, web: 85, database: 82 },
  { id: "2024014", name: "何雨萱", gender: "女", chinese: 76, math: 80, english: 85, web: 78, database: 72 },
  { id: "2024015", name: "罗子睿", gender: "男", chinese: 95, math: 88, english: 90, web: 92, database: 86 },
  { id: "2024016", name: "宋佳怡", gender: "女", chinese: 68, math: 72, english: 75, web: 70, database: 65 },
  { id: "2024017", name: "唐梓涵", gender: "男", chinese: 85, math: 90, english: 88, web: 95, database: 92 },
  { id: "2024018", name: "许若曦", gender: "女", chinese: 92, math: 96, english: 94, web: 98, database: 95 }
];

// 暴露到全局，供页面使用
window.SUBJECTS = SUBJECTS;
window.STUDENTS = STUDENTS;
