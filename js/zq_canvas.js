/**
 * zq_canvas.js — LLM 实践展示页背景动画
 * 作者：张乾　学号：24002120504
 * 建立时间：2026-11-25
 * 使用大模型：DeepSeek-V4.1-Flash
 * 功能名称：在 #zqCanvas 上绘制缓速漂移的粒子与连线，作为页面背景氛围层
 */

(function () {
  var zq_canvas = document.getElementById('zqCanvas');
  if (!zq_canvas || !zq_canvas.getContext) { return; }

  var zq_ctx = zq_canvas.getContext('2d');
  var zq_dots = [];
  var zq_raf = null;
  var zq_dpr = Math.min(window.devicePixelRatio || 1, 2);

  var ZQ_COUNT = 46;          // 粒子数量
  var ZQ_LINK_DIST = 148;     // 连线触发距离
  var ZQ_COLOR = '176, 141, 79'; // 金棕色（RGB）

  /**
   * 按窗口尺寸重置画布像素，并补齐/裁剪粒子数量
   */
  function zq_resize() {
    var zq_w = window.innerWidth;
    var zq_h = window.innerHeight;

    zq_canvas.width = Math.floor(zq_w * zq_dpr);
    zq_canvas.height = Math.floor(zq_h * zq_dpr);
    zq_canvas.style.width = zq_w + 'px';
    zq_canvas.style.height = zq_h + 'px';
    zq_ctx.setTransform(zq_dpr, 0, 0, zq_dpr, 0, 0);

    zq_dots = [];
    for (var zq_i = 0; zq_i < ZQ_COUNT; zq_i++) {
      zq_dots.push(zq_createDot(zq_w, zq_h));
    }
  }

  /**
   * 生成一个位置随机、速度缓慢的粒子
   */
  function zq_createDot(zq_w, zq_h) {
    return {
      x: Math.random() * zq_w,
      y: Math.random() * zq_h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.8 + 1
    };
  }

  /**
   * 计算并绘制一帧：清屏、移动粒子、画点、画近距离连线
   */
  function zq_draw() {
    var zq_w = window.innerWidth;
    var zq_h = window.innerHeight;

    zq_ctx.clearRect(0, 0, zq_w, zq_h);

    for (var zq_i = 0; zq_i < zq_dots.length; zq_i++) {
      var zq_d = zq_dots[zq_i];

      zq_d.x += zq_d.vx;
      zq_d.y += zq_d.vy;

      // 越界后从对侧回卷
      if (zq_d.x < -10) { zq_d.x = zq_w + 10; }
      if (zq_d.x > zq_w + 10) { zq_d.x = -10; }
      if (zq_d.y < -10) { zq_d.y = zq_h + 10; }
      if (zq_d.y > zq_h + 10) { zq_d.y = -10; }

      zq_ctx.beginPath();
      zq_ctx.arc(zq_d.x, zq_d.y, zq_d.r, 0, Math.PI * 2);
      zq_ctx.fillStyle = 'rgba(' + ZQ_COLOR + ', 0.5)';
      zq_ctx.fill();
    }

    // 粒子之间的距离越近，连线越明显
    for (var zq_m = 0; zq_m < zq_dots.length; zq_m++) {
      for (var zq_n = zq_m + 1; zq_n < zq_dots.length; zq_n++) {
        var zq_dx = zq_dots[zq_m].x - zq_dots[zq_n].x;
        var zq_dy = zq_dots[zq_m].y - zq_dots[zq_n].y;
        var zq_dist = Math.sqrt(zq_dx * zq_dx + zq_dy * zq_dy);

        if (zq_dist < ZQ_LINK_DIST) {
          zq_ctx.beginPath();
          zq_ctx.moveTo(zq_dots[zq_m].x, zq_dots[zq_m].y);
          zq_ctx.lineTo(zq_dots[zq_n].x, zq_dots[zq_n].y);
          zq_ctx.strokeStyle = 'rgba(' + ZQ_COLOR + ', ' + (0.16 * (1 - zq_dist / ZQ_LINK_DIST)).toFixed(3) + ')';
          zq_ctx.lineWidth = 1;
          zq_ctx.stroke();
        }
      }
    }

    zq_raf = window.requestAnimationFrame(zq_draw);
  }

  /**
   * 窗口尺寸变化时重建画布，使用防抖避免频繁重算
   */
  var zq_timer = null;
  window.addEventListener('resize', function () {
    if (zq_timer) { clearTimeout(zq_timer); }
    zq_timer = setTimeout(zq_resize, 180);
  });

  /**
   * 页面不可见时暂停动画，回到前台再继续，省电
   */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (zq_raf) { window.cancelAnimationFrame(zq_raf); zq_raf = null; }
    } else if (!zq_raf) {
      zq_draw();
    }
  });

  zq_resize();
  zq_draw();
})();
