/**
 * ============================================================
 * Hamyar Tools — Layout Manager
 * ============================================================
 * مدیر متمرکز لایه‌بندی ماژول‌های پایین صفحه
 *
 * منطق اولویت‌بندی (بالاترین لایه = مبنا):
 *   ۱. فوتر چسبان (sticky-footer)        — همیشه بالاترین وقتی فعاله
 *   ۲. نوار اعلان پایین (promo-bar)       — وقتی فوتر چسبان نباشه
 *   ۳. منوی موبایلی (mobile-menu)         — وقتی نوار اعلان پایین نباشه (فقط موبایل)
 *   ۴. پیش‌فرض                            — هیچ‌کدوم نباشن
 *
 * نکته: وقتی فوتر چسبان push میشه، نوار اعلان و منوی موبایلی روی اون قرار می‌گیرن
 *       پس عملا اونا مبنا میشن نه فوتر چسبان. این منطق توسط هر ماژول قبل از register
 *       اعمال میشه (هر ماژول وقتی روی ماژول دیگه‌ای میره، height نهایی خودش = height خودش + height زیرش).
 *
 * API:
 *   HmytLayout.register(id, { position, height, visible, priority })
 *   HmytLayout.unregister(id)
 *   HmytLayout.update(id, partial)
 *   HmytLayout.getBottomOffset() — برمی‌گرده بالاترین offset لازم برای ماژول‌های شناور
 *   HmytLayout.onChange(callback) — هر تغییری اطلاع بده
 *   HmytLayout.whenReady(callback) — بعد از محاسبه‌ی اولیه و پایدارِ چیدمان اجرا می‌شود
 * ============================================================
 */
(function (window, document) {
    'use strict';

    if (window.HmytLayout) return; // جلوگیری از init دوباره

    // Bottom stack order: promo bar, mobile menu, sticky purchase footer.
    var PRIORITY = {
        'sticky-footer': 30,
        'mobile-menu':   20,
        'promo-bar':     10
    };

    var EXCLUSIVE_GROUP = {
        'sticky-footer': 'primary-bottom-action',
        'mobile-menu':   'primary-bottom-action'
    };

    var EVENTS = {
        LOCK:   'hmyt:floating:lock',
        UNLOCK: 'hmyt:floating:unlock',
        PUSH:   'hmyt:floating:push',
        PUSHED: 'hmyt:floating:pushed',
        TOGGLE: 'hmyt:floating:toggle',
        RESET:  'hmyt:floating:reset',
        READY:  'hmyt:layout:ready'
    };

    var modules = {};   // { id: { position, height, visible, priority } }
    var listeners = []; // callback های onChange
    var readyListeners = [];
    var lastBottomOffset = 0;
    var isReady = false;
    var readyTimer = 0;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    /**
     * محاسبه بالاترین مبنا برای ماژول‌های شناور (چت‌بات، ویجت تماس)
     *
     * منطق:
     *   - فقط ماژول‌های پایین صفحه و visible
     *   - منوی موبایلی فقط در موبایل
     *   - مبنا = بالاترین لبه‌ی فوقانیِ بالاترین ماژول فعال
     *   - height ماژول‌ها به‌صورت stack جمع نمیشه؛ هر ماژول می‌دونه که آیا روی ماژول دیگه‌ای سواره
     *     و height ادعاشده‌ی خودش (که نسبت به پایین صفحه است) رو register می‌کنه
     */
    function computeBottomOffset() {
        var maxOffset = 0;
        var activeMobile = isMobile();

        Object.keys(modules).forEach(function (id) {
            var m = modules[id];
            if (!m.visible) return;
            if (m.position !== 'bottom') return;
            if (id === 'mobile-menu' && !activeMobile) return;

            // height بالاترین لبه‌ی این ماژول نسبت به پایین صفحه است
            if (m.height > maxOffset) {
                maxOffset = m.height;
            }
        });

        return maxOffset;
    }

    function computeBottomOffsetBelow(id) {
        var maxOffset = 0;
        var activeMobile = isMobile();
        var target = modules[id];
        var targetPriority = target ? target.priority : (PRIORITY[id] || 0);
        var targetExclusiveGroup = target
            ? target.exclusiveGroup
            : (EXCLUSIVE_GROUP[id] || '');

        Object.keys(modules).forEach(function (moduleId) {
            if (moduleId === id) return;

            var m = modules[moduleId];
            if (!m.visible || m.position !== 'bottom') return;
            if (moduleId === 'mobile-menu' && !activeMobile) return;
            if (
                targetExclusiveGroup &&
                m.exclusiveGroup === targetExclusiveGroup
            ) {
                return;
            }
            if (m.priority >= targetPriority) return;

            if (m.height > maxOffset) {
                maxOffset = m.height;
            }
        });

        return maxOffset;
    }

    function applyAndNotify() {
        var offset = computeBottomOffset();
        if (offset !== lastBottomOffset) {
            lastBottomOffset = offset;

        // CSS variable سراسری برای استفاده‌ی هر ماژولی که بخواد
            document.documentElement.style.setProperty('--hmyt-floating-bottom-offset', offset + 'px');
        }

        // اطلاع به subscriber ها
        listeners.forEach(function (fn) {
            try { fn(offset); } catch (e) { /* silent */ }
        });
    }

    function markReady() {
        if (isReady) return;

        // یک محاسبه‌ی نهایی درست پیش از آزادکردن FABها.
        applyAndNotify();
        isReady = true;
        document.documentElement.classList.add('hmyt-layout-ready');

        var callbacks = readyListeners.slice();
        readyListeners = [];
        callbacks.forEach(function (fn) {
            try { fn(lastBottomOffset); } catch (e) { /* silent */ }
        });

        window.dispatchEvent(new CustomEvent(EVENTS.READY, {
            detail: { offset: lastBottomOffset }
        }));
    }

    function scheduleInitialReady() {
        if (isReady || readyTimer) return;

        // ماژول‌های موجود: promo-bar در ۵۰ms و mobile-menu در ۱۰۰ms
        // اندازه‌ی اولیه‌شان را ثبت می‌کنند. این پنجره‌ی کوتاه تضمین می‌کند
        // FABها فقط بعد از آخرین موقعیت اولیه و پیش از نمایش، آزاد شوند.
        readyTimer = window.setTimeout(function () {
            readyTimer = 0;
            window.requestAnimationFrame(markReady);
        }, 140);
    }

    var HmytLayout = {
        events: EVENTS,

        register: function (id, opts) {
            opts = opts || {};
            modules[id] = {
                position: opts.position || 'bottom',
                height:   opts.height || 0,
                visible:  opts.visible !== false,
                priority: opts.priority || PRIORITY[id] || 0,
                exclusiveGroup: opts.exclusiveGroup || EXCLUSIVE_GROUP[id] || ''
            };
            applyAndNotify();
        },

        unregister: function (id) {
            delete modules[id];
            applyAndNotify();
        },

        update: function (id, partial) {
            if (!modules[id]) return;
            Object.keys(partial).forEach(function (key) {
                modules[id][key] = partial[key];
            });
            applyAndNotify();
        },

        getBottomOffset: function () {
            return lastBottomOffset;
        },

        getBottomOffsetBelow: function (id) {
            return computeBottomOffsetBelow(id);
        },

        getModule: function (id) {
            return modules[id] || null;
        },

        onChange: function (callback) {
            if (typeof callback === 'function') {
                listeners.push(callback);
            }
            return function unsubscribe() {
                listeners = listeners.filter(function (fn) { return fn !== callback; });
            };
        },

        isReady: function () {
            return isReady;
        },

        whenReady: function (callback) {
            if (typeof callback !== 'function') return function () {};

            if (isReady) {
                window.requestAnimationFrame(function () {
                    callback(lastBottomOffset);
                });
                return function () {};
            }

            readyListeners.push(callback);
            return function unsubscribeReady() {
                readyListeners = readyListeners.filter(function (fn) { return fn !== callback; });
            };
        },

        // برای debug
        _dump: function () {
            return { modules: modules, currentOffset: lastBottomOffset };
        }
    };

    // پاسخ به تغییر سایز پنجره (مهم چون منوی موبایلی فقط در موبایل حساب میشه)
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // force recompute
            lastBottomOffset = -1;
            applyAndNotify();
        }, 100);
    });

    window.HmytLayout = HmytLayout;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleInitialReady, { once: true });
    } else {
        scheduleInitialReady();
    }

})(window, document);
