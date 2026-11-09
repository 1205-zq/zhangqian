/**
 * 作者：张乾
 * 建立时间：2026-11-04 14:05
 * 使用大模型：DeepSeek-V4.1-Flash
 * 功能名称：新闻排行榜选项卡切换（点击排行 / 评论排行）
 */

/**
 * 初始化排行榜选项卡：为选项卡绑定点击监听，并激活默认选中的那一项
 * @param {string} zq_cardSelector 排行榜卡片容器的选择器
 */
function zq_initRankTabs(zq_cardSelector) {
  const zq_card = document.querySelector(zq_cardSelector);
  if (!zq_card) return;

  const zq_tabBtns = Array.prototype.slice.call(
    zq_card.querySelectorAll('.zq_tabBtn')
  );
  const zq_lists = Array.prototype.slice.call(
    zq_card.querySelectorAll('.zq_list')
  );

  /**
   * 清除所有选项卡与排行榜列表的选中状态
   */
  function zq_clearActive() {
    zq_tabBtns.forEach(function (zq_btn) {
      zq_btn.classList.remove('zq_tabBtn--active');
      zq_btn.setAttribute('aria-selected', 'false');
    });

    zq_lists.forEach(function (zq_list) {
      zq_list.classList.remove('zq_list--active');
    });
  }

  /**
   * 激活指定选项卡：先清除全部选中状态，再设置当前选项卡与其对应列表为选中状态
   * @param {HTMLElement} zq_currentBtn 当前被点击的选项卡按钮
   */
  function zq_activateTab(zq_currentBtn) {
    zq_clearActive();

    zq_currentBtn.classList.add('zq_tabBtn--active');
    zq_currentBtn.setAttribute('aria-selected', 'true');

    const zq_tabKey = zq_currentBtn.dataset.zqTab;
    const zq_targetList = zq_card.querySelector(
      '.zq_list[data-zq-list="' + zq_tabKey + '"]'
    );

    if (zq_targetList) {
      zq_targetList.classList.add('zq_list--active');
    }
  }

  /**
   * 为每个选项卡绑定点击监听事件，点击后切换到对应排行榜
   */
  zq_tabBtns.forEach(function (zq_btn) {
    zq_btn.addEventListener('click', function () {
      zq_activateTab(zq_btn);
    });
  });

  /**
   * 处理默认选中项：优先使用 HTML 中预先标记为选中的选项卡，否则取第一项
   */
  const zq_defaultBtn =
    zq_card.querySelector('.zq_tabBtn.zq_tabBtn--active') || zq_tabBtns[0];

  if (zq_defaultBtn) {
    zq_activateTab(zq_defaultBtn);
  }
}

/**
 * 页面加载完成后初始化排行榜选项卡
 */
document.addEventListener('DOMContentLoaded', function () {
  zq_initRankTabs('#zq_rankCard');
});
