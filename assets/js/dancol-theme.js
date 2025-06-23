/**
 * Dancol UI Framework - 丹青UI框架
 * 主题切换JavaScript文件
 * 版本: 1.0.0
 * 作者: Dancol Team
 * 描述: 提供主题切换功能
 */

(function(global) {
  'use strict';

  // 主题配置
  const THEMES = {
    'light-blue': {
      name: '淡蓝主题',
      description: '清新淡雅的蓝色系',
      color: '#6ba3d6'
    },
    'light-green': {
      name: '淡绿主题',
      description: '自然舒适的绿色系',
      color: '#68d391'
    },
    'cream': {
      name: '米黄主题',
      description: '温暖典雅的米黄色系',
      color: '#d69e2e'
    },
    'warm': {
      name: '柔和主题',
      description: '温暖如阳光的暖色调',
      color: '#ed8936'
    },
    'dark': {
      name: '深色主题',
      description: '适合夜晚浏览的深色模式',
      color: '#60a5fa'
    }
  };

  const DEFAULT_THEME = 'light-blue';
  const STORAGE_KEY = 'dancol-theme';

  // 主题管理器
  const Theme = {
    currentTheme: DEFAULT_THEME,
    switchers: [],

    /**
     * 初始化主题系统
     */
    init() {
      // 从本地存储加载主题
      this.loadTheme();
      
      // 应用主题
      this.applyTheme(this.currentTheme);
      
      // 初始化主题切换器
      this.initSwitchers();
      
      console.log('主题系统已初始化，当前主题:', THEMES[this.currentTheme].name);
    },

    /**
     * 从本地存储加载主题
     */
    loadTheme() {
      try {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme && THEMES[savedTheme]) {
          this.currentTheme = savedTheme;
        }
      } catch (e) {
        console.warn('无法从本地存储加载主题设置:', e);
      }
    },

    /**
     * 保存主题到本地存储
     * @param {string} theme - 主题名称
     */
    saveTheme(theme) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        console.warn('无法保存主题设置到本地存储:', e);
      }
    },

    /**
     * 应用主题
     * @param {string} theme - 主题名称
     */
    applyTheme(theme) {
      if (!THEMES[theme]) {
        console.warn(`未知主题: ${theme}`);
        return;
      }

      // 设置data-theme属性
      document.documentElement.setAttribute('data-theme', theme);
      
      // 更新当前主题
      this.currentTheme = theme;
      
      // 保存到本地存储
      this.saveTheme(theme);
      
      // 更新所有主题切换器
      this.updateSwitchers();
      
      // 触发主题变更事件
      document.dispatchEvent(new CustomEvent('dancol:theme-changed', {
        detail: {
          theme: theme,
          themeInfo: THEMES[theme]
        }
      }));
      
      console.log('主题已切换为:', THEMES[theme].name);
    },

    /**
     * 获取当前主题
     * @returns {string}
     */
    getCurrentTheme() {
      return this.currentTheme;
    },

    /**
     * 获取主题信息
     * @param {string} theme - 主题名称
     * @returns {Object|null}
     */
    getThemeInfo(theme) {
      return THEMES[theme] || null;
    },

    /**
     * 获取所有主题
     * @returns {Object}
     */
    getAllThemes() {
      return { ...THEMES };
    },

    /**
     * 初始化主题切换器
     */
    initSwitchers() {
      const switchers = document.querySelectorAll('.dancol-theme-switcher');
      
      switchers.forEach(switcher => {
        this.initSwitcher(switcher);
      });
    },

    /**
     * 初始化单个主题切换器
     * @param {Element} switcher - 主题切换器元素
     */
    initSwitcher(switcher) {
      if (this.switchers.includes(switcher)) {
        return; // 已经初始化过
      }

      const button = switcher.querySelector('.dancol-theme-switcher-button');
      const dropdown = switcher.querySelector('.dancol-theme-switcher-dropdown');
      
      if (!button || !dropdown) {
        console.warn('主题切换器结构不完整');
        return;
      }

      // 生成主题选项
      this.generateThemeOptions(dropdown);
      
      // 绑定事件
      this.bindSwitcherEvents(switcher, button, dropdown);
      
      // 更新显示
      this.updateSwitcher(switcher);
      
      // 添加到管理列表
      this.switchers.push(switcher);
    },

    /**
     * 生成主题选项
     * @param {Element} dropdown - 下拉菜单元素
     */
    generateThemeOptions(dropdown) {
      dropdown.innerHTML = '';
      
      Object.keys(THEMES).forEach(themeKey => {
        const theme = THEMES[themeKey];
        const option = document.createElement('button');
        option.className = 'dancol-theme-option';
        option.setAttribute('data-theme', themeKey);
        
        option.innerHTML = `
          <span class="dancol-theme-color ${themeKey}" style="background-color: ${theme.color}"></span>
          <span class="dancol-theme-name">${theme.name}</span>
        `;
        
        dropdown.appendChild(option);
      });
    },

    /**
     * 绑定主题切换器事件
     * @param {Element} switcher - 主题切换器元素
     * @param {Element} button - 按钮元素
     * @param {Element} dropdown - 下拉菜单元素
     */
    bindSwitcherEvents(switcher, button, dropdown) {
      // 点击按钮切换下拉菜单
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = dropdown.classList.contains('active');
        
        // 关闭所有其他下拉菜单
        this.closeAllDropdowns();
        
        if (!isActive) {
          dropdown.classList.add('active');
        }
      });

      // 点击主题选项
      dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.dancol-theme-option');
        if (option) {
          const theme = option.getAttribute('data-theme');
          this.applyTheme(theme);
          dropdown.classList.remove('active');
        }
      });

      // 点击外部关闭下拉菜单
      document.addEventListener('click', () => {
        dropdown.classList.remove('active');
      });

      // 阻止下拉菜单内部点击冒泡
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    },

    /**
     * 关闭所有下拉菜单
     */
    closeAllDropdowns() {
      this.switchers.forEach(switcher => {
        const dropdown = switcher.querySelector('.dancol-theme-switcher-dropdown');
        if (dropdown) {
          dropdown.classList.remove('active');
        }
      });
    },

    /**
     * 更新所有主题切换器
     */
    updateSwitchers() {
      this.switchers.forEach(switcher => {
        this.updateSwitcher(switcher);
      });
    },

    /**
     * 更新单个主题切换器
     * @param {Element} switcher - 主题切换器元素
     */
    updateSwitcher(switcher) {
      const button = switcher.querySelector('.dancol-theme-switcher-button');
      const dropdown = switcher.querySelector('.dancol-theme-switcher-dropdown');
      
      if (button) {
        const currentTheme = THEMES[this.currentTheme];
        const themeNameSpan = button.querySelector('.dancol-theme-name');
        const themeColorSpan = button.querySelector('.dancol-theme-color');
        
        if (themeNameSpan) {
          themeNameSpan.textContent = currentTheme.name;
        }
        
        if (themeColorSpan) {
          themeColorSpan.style.backgroundColor = currentTheme.color;
        }
      }
      
      if (dropdown) {
        // 更新选中状态
        const options = dropdown.querySelectorAll('.dancol-theme-option');
        options.forEach(option => {
          const theme = option.getAttribute('data-theme');
          if (theme === this.currentTheme) {
            option.classList.add('active');
          } else {
            option.classList.remove('active');
          }
        });
      }
    },

    /**
     * 创建主题切换器
     * @param {Object} options - 配置选项
     * @returns {Element}
     */
    createSwitcher(options = {}) {
      const config = {
        showText: true,
        showIcon: true,
        ...options
      };

      const switcher = document.createElement('div');
      switcher.className = 'dancol-theme-switcher';
      
      const currentTheme = THEMES[this.currentTheme];
      
      switcher.innerHTML = `
        <button class="dancol-theme-switcher-button">
          ${config.showIcon ? `<span class="dancol-theme-color ${this.currentTheme}" style="background-color: ${currentTheme.color}"></span>` : ''}
          ${config.showText ? `<span class="dancol-theme-name">${currentTheme.name}</span>` : ''}
          <svg class="dancol-theme-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="dancol-theme-switcher-dropdown"></div>
      `;
      
      // 初始化这个切换器
      this.initSwitcher(switcher);
      
      return switcher;
    }
  };

  // 将Theme添加到Dancol命名空间
  if (global.Dancol) {
    global.Dancol.Theme = Theme;
  } else {
    global.DancolTheme = Theme;
  }

})(window);
