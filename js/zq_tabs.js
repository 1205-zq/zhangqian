/**
 * 作者：张乾
 * 建立时间：2026-11-04 13:42
 * 使用大模型：DeepSeek-V4.1-Flash
 * 功能名称：可复用 Tab 选项卡组件（监听点击、先清空全部选中态、再设置当前项选中态）
 */

/**
 * 初始化选项卡组件：为选项卡绑定点击监听，并激活默认选中的那一项
 * @param {string} zq_containerSelector 选项卡外层容器的选择器，可在同一页面初始化多个实例
 */
function zq_initTabs(zq_containerSelector) {
  const zq_container = document.querySelector(zq_containerSelector);
  if (!zq_container) return;

  const zq_tabList = Array.prototype.slice.call(
    zq_container.querySelectorAll('.zq_tab')
  );
  const zq_panelList = Array.prototype.slice.call(
    zq_container.querySelectorAll('.zq_panel')
  );

  /**
   * 清除所有选项卡与内容面板的选中状态
   */
  function zq_clearActive() {
    zq_tabList.forEach(function (zq_tab) {
      zq_tab.classList.remove('zq_tab--active');
      zq_tab.setAttribute('aria-selected', 'false');
    });

    zq_panelList.forEach(function (zq_panel) {
      zq_panel.classList.remove('zq_panel--active');
    });
  }

  /**
   * 激活指定选项卡：先清除全部选中态，再设置当前选项卡与其对应内容为选中态
   * @param {HTMLElement} zq_currentTab 当前被点击的选项卡元素
   */
  function zq_activateTab(zq_currentTab) {
    zq_clearActive();

    zq_currentTab.classList.add('zq_tab--active');
    zq_currentTab.setAttribute('aria-selected', 'true');

    const zq_tabKey = zq_currentTab.dataset.zqTab;
    const zq_targetPanel = zq_container.querySelector(
      '.zq_panel[data-zq-panel="' + zq_tabKey + '"]'
    );

    if (zq_targetPanel) {
      zq_targetPanel.classList.add('zq_panel--active');
    }
  }

  /**
   * 为每个选项卡绑定点击监听事件，点击后切换到对应内容
   */
  zq_tabList.forEach(function (zq_tab) {
    zq_tab.addEventListener('click', function () {
      zq_activateTab(zq_tab);
    });
  });

  /**
   * 处理默认选中项：优先使用 HTML 中预先标记为选中的选项卡，否则取第一项
   */
  const zq_defaultTab =
    zq_container.querySelector('.zq_tab.zq_tab--active') || zq_tabList[0];

  if (zq_defaultTab) {
    zq_activateTab(zq_defaultTab);
  }
}

/**
 * 页面加载完成后初始化本页的新闻选项卡
 */
document.addEventListener('DOMContentLoaded', function () {
  zq_initTabs('#zq_newsTabs');
});
