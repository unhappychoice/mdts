"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_material_1 = require("@mui/icons-material");
const material_1 = require("@mui/material");
const react_1 = require("react");
const useContent_1 = require("../hooks/apis/useContent");
const FileTreeContext_1 = require("../contexts/FileTreeContext");
const MarkdownPreview_1 = __importDefault(require("./MarkdownPreview"));
const Content = ({ selectedFilePath, contentMode = 'fixed', scrollToId, onDirectorySelect }) => {
    const [viewMode, setViewMode] = (0, react_1.useState)('preview');
    const { content, loading: contentLoading, error } = (0, useContent_1.useContent)(selectedFilePath);
    const { loading: fileTreeLoading } = (0, FileTreeContext_1.useFileTreeContext)();
    const loading = contentLoading || fileTreeLoading;
    (0, react_1.useEffect)(() => {
        if (scrollToId) {
            const element = document.getElementById(scrollToId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [scrollToId]);
    const displayFileName = selectedFilePath
        ? selectedFilePath.split('/').pop()
        : loading ? '' : '🎉 Welcome to mdts!';
    const pathSegments = selectedFilePath
        ? selectedFilePath.split('/').filter(segment => segment !== '')
        : [];
    if (error)
        return (0, jsx_runtime_1.jsxs)("p", { children: ["Error: ", error] });
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: Object.assign({ flexGrow: 1, p: 4, bgcolor: 'background.paper' }, (contentMode === 'fixed' && {
            maxWidth: '800px',
            margin: '0 auto',
        })), children: [selectedFilePath && ((0, jsx_runtime_1.jsx)(material_1.Breadcrumbs, { "aria-label": "breadcrumb", sx: { mb: 4 }, children: pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const path = pathSegments.slice(0, index + 1).join('/');
                    return isLast ? ((0, jsx_runtime_1.jsx)(material_1.Typography, { color: "text.primary", children: segment }, path)) : ((0, jsx_runtime_1.jsx)(material_1.Link, { color: "inherit", href: "#", onClick: () => onDirectorySelect && onDirectorySelect(path), children: segment }, path));
                }) })), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', mb: 4 }, children: [(0, jsx_runtime_1.jsx)(icons_material_1.ArticleOutlined, { sx: { mr: 2 }, fontSize: "large" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, sx: { mb: 0 }, children: displayFileName })] }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { paddingLeft: '24px', marginLeft: '-32px', marginRight: '-32px', borderBottom: 1, borderColor: 'divider' }, children: (0, jsx_runtime_1.jsxs)(material_1.Tabs, { value: viewMode, onChange: (event, newValue) => setViewMode(newValue), "aria-label": "view mode tabs", children: [(0, jsx_runtime_1.jsx)(material_1.Tab, { value: "preview", label: "Preview" }), (0, jsx_runtime_1.jsx)(material_1.Tab, { value: "raw", label: "Raw" })] }) }), loading ? ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) })) : viewMode === 'preview' ? ((0, jsx_runtime_1.jsx)(MarkdownPreview_1.default, { content: content })) : ((0, jsx_runtime_1.jsx)(material_1.Box, { component: "pre", sx: { whiteSpace: 'pre-wrap', p: 2, bgcolor: 'background.default', borderRadius: 1 }, children: content }))] }));
};
exports.default = Content;
