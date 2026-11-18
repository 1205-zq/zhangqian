/**
 * 作者：张乾
 * 建立时间：2026-11-13 14:08
 * 使用大模型：DeepSeek-V4.1-Flash
 * 功能名称：诗词数据服务器（读取 db.json 的 poems，提供接口与静态页面访问）
 *
 * 启动：node db/server.js   访问：http://127.0.0.1:3004/poems.html
 */
const zq_express = require('express');
const zq_path = require('path');
const zq_fs = require('fs');

const zq_PORT = 3004;
const zq_DB_FILE = zq_path.join(__dirname, 'db.json');
const zq_WEB_ROOT = zq_path.resolve(__dirname, '..');

const zq_app = zq_express();

/**
 * 读取 db.json 并返回其中的 poems 数组
 */
function zq_readPoems() {
  const zq_raw = zq_fs.readFileSync(zq_DB_FILE, 'utf8');
  const zq_data = JSON.parse(zq_raw);
  return Array.isArray(zq_data.poems) ? zq_data.poems : [];
}

/**
 * 统一放行跨域请求，便于页面直接双击以 file:// 方式打开时也能取到数据
 */
zq_app.use((zq_req, zq_res, zq_next) => {
  zq_res.setHeader('Access-Control-Allow-Origin', '*');
  zq_next();
});

/**
 * 接口：返回 poems 全部数据
 */
zq_app.get('/api/poems', (zq_req, zq_res) => {
  try {
    zq_res.json({ code: 0, data: zq_readPoems() });
  } catch (zq_err) {
    zq_res.status(500).json({ code: 1, message: '读取 db.json 失败：' + zq_err.message });
  }
});

// 把项目根目录作为静态目录，页面与 css/js 资源可直接通过本服务访问
zq_app.use(zq_express.static(zq_WEB_ROOT));

/**
 * 启动服务并打印可访问地址
 */
zq_app.listen(zq_PORT, () => {
  console.log('诗词数据服务已启动：');
  console.log('  数据接口  http://127.0.0.1:' + zq_PORT + '/api/poems');
  console.log('  页面地址  http://127.0.0.1:' + zq_PORT + '/poems.html');
});
