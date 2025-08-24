export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => Array.from(document.querySelectorAll(sel));

export const initOnce = (key, fn) => {
    window.__inits__ = window.__inits__ || {};
    if (window.__inits__[key]) return window.__inits__[key];
    window.__inits__[key] = fn();
    return window.__inits__[key];
};