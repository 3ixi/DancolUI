/**
 * Dancol UI Framework - 丹青UI框架
 * 核心JavaScript文件
 * 版本: 1.0.0
 * 作者: Dancol Team
 * 描述: 提供框架的核心功能和工具函数
 */

(function(global) {
  'use strict';

  // 创建Dancol命名空间
  const Dancol = {
    version: '1.0.0',
    
    // 工具函数
    utils: {
      /**
       * 选择DOM元素
       * @param {string} selector - CSS选择器
       * @param {Element} context - 上下文元素
       * @returns {Element|null}
       */
      $(selector, context = document) {
        return context.querySelector(selector);
      },

      /**
       * 选择多个DOM元素
       * @param {string} selector - CSS选择器
       * @param {Element} context - 上下文元素
       * @returns {NodeList}
       */
      $$(selector, context = document) {
        return context.querySelectorAll(selector);
      },

      /**
       * 添加事件监听器
       * @param {Element} element - 目标元素
       * @param {string} event - 事件类型
       * @param {Function} handler - 事件处理函数
       * @param {boolean|Object} options - 事件选项
       */
      on(element, event, handler, options = false) {
        if (element && typeof handler === 'function') {
          element.addEventListener(event, handler, options);
        }
      },

      /**
       * 移除事件监听器
       * @param {Element} element - 目标元素
       * @param {string} event - 事件类型
       * @param {Function} handler - 事件处理函数
       * @param {boolean|Object} options - 事件选项
       */
      off(element, event, handler, options = false) {
        if (element && typeof handler === 'function') {
          element.removeEventListener(event, handler, options);
        }
      },

      /**
       * 添加CSS类
       * @param {Element} element - 目标元素
       * @param {string} className - 类名
       */
      addClass(element, className) {
        if (element && className) {
          element.classList.add(className);
        }
      },

      /**
       * 移除CSS类
       * @param {Element} element - 目标元素
       * @param {string} className - 类名
       */
      removeClass(element, className) {
        if (element && className) {
          element.classList.remove(className);
        }
      },

      /**
       * 切换CSS类
       * @param {Element} element - 目标元素
       * @param {string} className - 类名
       * @returns {boolean}
       */
      toggleClass(element, className) {
        if (element && className) {
          return element.classList.toggle(className);
        }
        return false;
      },

      /**
       * 检查是否包含CSS类
       * @param {Element} element - 目标元素
       * @param {string} className - 类名
       * @returns {boolean}
       */
      hasClass(element, className) {
        if (element && className) {
          return element.classList.contains(className);
        }
        return false;
      },

      /**
       * 设置元素属性
       * @param {Element} element - 目标元素
       * @param {string|Object} attr - 属性名或属性对象
       * @param {string} value - 属性值
       */
      attr(element, attr, value) {
        if (!element) return;
        
        if (typeof attr === 'object') {
          Object.keys(attr).forEach(key => {
            element.setAttribute(key, attr[key]);
          });
        } else if (value !== undefined) {
          element.setAttribute(attr, value);
        } else {
          return element.getAttribute(attr);
        }
      },

      /**
       * 移除元素属性
       * @param {Element} element - 目标元素
       * @param {string} attr - 属性名
       */
      removeAttr(element, attr) {
        if (element && attr) {
          element.removeAttribute(attr);
        }
      },

      /**
       * 设置或获取元素数据属性
       * @param {Element} element - 目标元素
       * @param {string} key - 数据键名
       * @param {*} value - 数据值
       * @returns {*}
       */
      data(element, key, value) {
        if (!element) return;
        
        const dataKey = `data-${key}`;
        if (value !== undefined) {
          element.setAttribute(dataKey, JSON.stringify(value));
        } else {
          const dataValue = element.getAttribute(dataKey);
          try {
            return JSON.parse(dataValue);
          } catch (e) {
            return dataValue;
          }
        }
      },

      /**
       * 创建DOM元素
       * @param {string} tagName - 标签名
       * @param {Object} attributes - 属性对象
       * @param {string} textContent - 文本内容
       * @returns {Element}
       */
      createElement(tagName, attributes = {}, textContent = '') {
        const element = document.createElement(tagName);
        
        Object.keys(attributes).forEach(key => {
          if (key === 'className') {
            element.className = attributes[key];
          } else if (key === 'style' && typeof attributes[key] === 'object') {
            Object.assign(element.style, attributes[key]);
          } else {
            element.setAttribute(key, attributes[key]);
          }
        });
        
        if (textContent) {
          element.textContent = textContent;
        }
        
        return element;
      },

      /**
       * 防抖函数
       * @param {Function} func - 要防抖的函数
       * @param {number} wait - 等待时间（毫秒）
       * @param {boolean} immediate - 是否立即执行
       * @returns {Function}
       */
      debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
          };
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(this, args);
        };
      },

      /**
       * 节流函数
       * @param {Function} func - 要节流的函数
       * @param {number} limit - 限制时间（毫秒）
       * @returns {Function}
       */
      throttle(func, limit) {
        let inThrottle;
        return function(...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      },

      /**
       * 深度合并对象
       * @param {Object} target - 目标对象
       * @param {...Object} sources - 源对象
       * @returns {Object}
       */
      deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
          for (const key in source) {
            if (this.isObject(source[key])) {
              if (!target[key]) Object.assign(target, { [key]: {} });
              this.deepMerge(target[key], source[key]);
            } else {
              Object.assign(target, { [key]: source[key] });
            }
          }
        }

        return this.deepMerge(target, ...sources);
      },

      /**
       * 检查是否为对象
       * @param {*} item - 要检查的项
       * @returns {boolean}
       */
      isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
      },

      /**
       * 生成唯一ID
       * @param {string} prefix - 前缀
       * @returns {string}
       */
      generateId(prefix = 'dancol') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
    },

    // 初始化框架
    init() {
      console.log(`Dancol UI Framework v${this.version} 已初始化`);
      
      // 初始化主题系统
      if (this.Theme) {
        this.Theme.init();
      }
      
      // 初始化Toast系统
      if (this.Toast) {
        this.Toast.init();
      }
      
      // 触发初始化完成事件
      document.dispatchEvent(new CustomEvent('dancol:ready', {
        detail: { version: this.version }
      }));
    }
  };

  // 将Dancol暴露到全局
  global.Dancol = Dancol;

  // DOM加载完成后自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Dancol.init());
  } else {
    Dancol.init();
  }

})(window);
