"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_markdown_1 = __importDefault(require("react-markdown"));
const react_syntax_highlighter_1 = require("react-syntax-highlighter");
const prism_1 = require("react-syntax-highlighter/dist/esm/styles/prism");
const rehype_raw_1 = __importDefault(require("rehype-raw"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const remark_slug_1 = __importDefault(require("remark-slug"));
const MarkdownPreview = ({ content }) => {
    const theme = (0, material_1.useTheme)();
    return ((0, jsx_runtime_1.jsx)(material_1.Box, { className: ["markdown-body", theme.palette.mode === 'dark' ? 'dark' : 'light'].join(' '), sx: { py: 2, px: 0, fontSize: '0.9rem' }, children: (0, jsx_runtime_1.jsx)(react_markdown_1.default, { remarkPlugins: [remark_gfm_1.default, remark_slug_1.default], rehypePlugins: [rehype_raw_1.default], components: {
                code(_a) {
                    var { node, inline, className, children } = _a, props = __rest(_a, ["node", "inline", "className", "children"]);
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? ((0, jsx_runtime_1.jsx)(react_syntax_highlighter_1.Prism, Object.assign({ style: theme.palette.mode === 'dark' ? prism_1.nightOwl : prism_1.prism, className: 'syntax-highlighter', customStyle: { margin: 0, background: 'transparent' }, showLineNumbers: true, language: match[1], PreTag: "div" }, props, { children: String(children).replace(/\n$/, '') }))) : ((0, jsx_runtime_1.jsx)("code", Object.assign({ className: className }, props, { children: children })));
                },
            }, children: content }) }));
};
exports.default = MarkdownPreview;
