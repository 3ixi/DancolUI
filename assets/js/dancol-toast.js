/**
 * Dancol UI Framework - 丹青UI框架
 * Toast消息系统JavaScript文件
 * 版本: 1.0.0
 * 作者: Dancol Team
 * 描述: 提供Toast消息功能
 */

(function(global) {
  'use strict';

  // Toast配置
  const DEFAULT_CONFIG = {
    position: 'top-right', // top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
    duration: 4000, // 显示时长（毫秒），0表示不自动关闭
    closable: true, // 是否显示关闭按钮
    showIcon: true, // 是否显示图标
    animation: 'slide', // 动画类型：slide, fade
    maxToasts: 5, // 最大同时显示的Toast数量
    style: 'default' // 样式类型：default, simple
  };

  // Toast类型配置
  const TOAST_TYPES = {
    success: {
      icon: '✓',
      title: '成功'
    },
    warning: {
      icon: '⚠',
      title: '警告'
    },
    error: {
      icon: '✕',
      title: '错误'
    },
    info: {
      icon: 'ℹ',
      title: '信息'
    }
  };

  // Toast管理器
  const Toast = {
    containers: new Map(),
    toasts: new Map(),
    config: { ...DEFAULT_CONFIG },

    /**
     * 初始化Toast系统
     */
    init() {
      console.log('Toast消息系统已初始化');
    },

    /**
     * 设置全局配置
     * @param {Object} config - 配置对象
     */
    setConfig(config) {
      this.config = { ...this.config, ...config };
    },

    /**
     * 获取或创建Toast容器
     * @param {string} position - 位置
     * @returns {Element}
     */
    getContainer(position) {
      if (!this.containers.has(position)) {
        const container = document.createElement('div');
        container.className = `dancol-toast-container ${position}`;
        document.body.appendChild(container);
        this.containers.set(position, container);
      }
      return this.containers.get(position);
    },

    /**
     * 显示Toast消息
     * @param {string} type - 消息类型
     * @param {string|Object} message - 消息内容或配置对象
     * @param {Object} options - 选项
     * @returns {string} Toast ID
     */
    show(type, message, options = {}) {
      // 处理参数
      let config;
      if (typeof message === 'object' && message !== null) {
        config = { ...this.config, ...message };
      } else {
        config = { ...this.config, ...options, message };
      }

      // 验证类型
      if (!TOAST_TYPES[type]) {
        console.warn(`未知的Toast类型: ${type}`);
        type = 'info';
      }

      // 生成唯一ID
      const toastId = this.generateId();
      
      // 获取容器
      const container = this.getContainer(config.position);
      
      // 检查最大数量限制
      this.enforceMaxToasts(container, config.maxToasts);
      
      // 创建Toast元素
      const toastElement = this.createToastElement(toastId, type, config);
      
      // 添加到容器
      container.appendChild(toastElement);
      
      // 添加进入动画
      requestAnimationFrame(() => {
        toastElement.classList.add('dancol-toast-enter');
      });
      
      // 存储Toast信息
      this.toasts.set(toastId, {
        element: toastElement,
        container: container,
        config: config,
        type: type
      });
      
      // 设置自动关闭
      if (config.duration > 0) {
        setTimeout(() => {
          this.hide(toastId);
        }, config.duration);
      }
      
      // 触发显示事件
      document.dispatchEvent(new CustomEvent('dancol:toast-show', {
        detail: { id: toastId, type: type, config: config }
      }));
      
      return toastId;
    },

    /**
     * 隐藏Toast消息
     * @param {string} toastId - Toast ID
     */
    hide(toastId) {
      const toast = this.toasts.get(toastId);
      if (!toast) return;

      const { element, container } = toast;
      
      // 添加退出动画
      element.classList.remove('dancol-toast-enter');
      element.classList.add('dancol-toast-exit');
      
      // 动画结束后移除元素
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        
        // 如果容器为空，移除容器
        if (container.children.length === 0) {
          container.parentNode.removeChild(container);
          this.containers.delete(toast.config.position);
        }
        
        // 从存储中移除
        this.toasts.delete(toastId);
        
        // 触发隐藏事件
        document.dispatchEvent(new CustomEvent('dancol:toast-hide', {
          detail: { id: toastId }
        }));
      }, 300);
    },

    /**
     * 创建Toast元素
     * @param {string} toastId - Toast ID
     * @param {string} type - 消息类型
     * @param {Object} config - 配置
     * @returns {Element}
     */
    createToastElement(toastId, type, config) {
      const toast = document.createElement('div');

      if (config.style === 'simple') {
        return this.createSimpleToastElement(toastId, type, config);
      }

      toast.className = `dancol-toast dancol-toast-${type}`;
      toast.setAttribute('data-toast-id', toastId);

      const typeConfig = TOAST_TYPES[type];
      const title = config.title || typeConfig.title;
      const message = config.message || '';

      let innerHTML = '';

      // 图标
      if (config.showIcon) {
        innerHTML += `<div class="dancol-toast-icon">${typeConfig.icon}</div>`;
      }

      // 内容
      innerHTML += '<div class="dancol-toast-content">';
      if (title) {
        innerHTML += `<div class="dancol-toast-title">${title}</div>`;
      }
      if (message) {
        innerHTML += `<div class="dancol-toast-message">${message}</div>`;
      }
      innerHTML += '</div>';

      // 关闭按钮
      if (config.closable) {
        innerHTML += '<button class="dancol-toast-close" type="button">×</button>';
      }

      toast.innerHTML = innerHTML;

      // 绑定关闭事件
      if (config.closable) {
        const closeBtn = toast.querySelector('.dancol-toast-close');
        closeBtn.addEventListener('click', () => {
          this.hide(toastId);
        });
      }

      return toast;
    },

    /**
     * 创建简洁Toast元素
     * @param {string} toastId - Toast ID
     * @param {string} type - 消息类型
     * @param {Object} config - 配置
     * @returns {Element}
     */
    createSimpleToastElement(toastId, type, config) {
      const toast = document.createElement('div');
      let className = `dancol-toast-simple dancol-toast-${type}`;

      if (!config.closable) {
        className += ' no-close';
      }

      toast.className = className;
      toast.setAttribute('data-toast-id', toastId);

      const message = config.message || '';

      let innerHTML = `<div class="dancol-toast-content">${message}</div>`;

      // 关闭按钮
      if (config.closable) {
        innerHTML += '<button class="dancol-toast-close" type="button">×</button>';
      }

      toast.innerHTML = innerHTML;

      // 绑定关闭事件
      if (config.closable) {
        const closeBtn = toast.querySelector('.dancol-toast-close');
        closeBtn.addEventListener('click', () => {
          this.hide(toastId);
        });
      }

      return toast;
    },

    /**
     * 强制执行最大Toast数量限制
     * @param {Element} container - 容器元素
     * @param {number} maxToasts - 最大数量
     */
    enforceMaxToasts(container, maxToasts) {
      const toasts = container.querySelectorAll('.dancol-toast');
      if (toasts.length >= maxToasts) {
        // 移除最旧的Toast
        const oldestToast = toasts[0];
        const toastId = oldestToast.getAttribute('data-toast-id');
        this.hide(toastId);
      }
    },

    /**
     * 生成唯一ID
     * @returns {string}
     */
    generateId() {
      return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * 清除所有Toast
     * @param {string} position - 位置（可选）
     */
    clear(position) {
      if (position) {
        const container = this.containers.get(position);
        if (container) {
          const toasts = container.querySelectorAll('.dancol-toast');
          toasts.forEach(toast => {
            const toastId = toast.getAttribute('data-toast-id');
            this.hide(toastId);
          });
        }
      } else {
        // 清除所有位置的Toast
        this.toasts.forEach((toast, toastId) => {
          this.hide(toastId);
        });
      }
    },

    // 便捷方法
    success(message, options) {
      return this.show('success', message, options);
    },

    warning(message, options) {
      return this.show('warning', message, options);
    },

    error(message, options) {
      return this.show('error', message, options);
    },

    info(message, options) {
      return this.show('info', message, options);
    },

    // 简洁样式便捷方法
    simpleSuccess(message, options = {}) {
      return this.show('success', message, { ...options, style: 'simple', showIcon: false });
    },

    simpleWarning(message, options = {}) {
      return this.show('warning', message, { ...options, style: 'simple', showIcon: false });
    },

    simpleError(message, options = {}) {
      return this.show('error', message, { ...options, style: 'simple', showIcon: false });
    },

    simpleInfo(message, options = {}) {
      return this.show('info', message, { ...options, style: 'simple', showIcon: false });
    }
  };

  // 将Toast添加到Dancol命名空间
  if (global.Dancol) {
    global.Dancol.Toast = Toast;
  } else {
    global.DancolToast = Toast;
  }

})(window);
