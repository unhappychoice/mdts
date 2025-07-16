"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Brightness4_1 = __importDefault(require("@mui/icons-material/Brightness4"));
const Brightness7_1 = __importDefault(require("@mui/icons-material/Brightness7"));
const CropFree_1 = __importDefault(require("@mui/icons-material/CropFree"));
const Fullscreen_1 = __importDefault(require("@mui/icons-material/Fullscreen"));
const material_1 = require("@mui/material");
const react_1 = require("react");
const Content_1 = __importDefault(require("./Content"));
const DirectoryContent_1 = __importDefault(require("./DirectoryContent"));
const FileTree_1 = __importDefault(require("./FileTree"));
const Outline_1 = __importDefault(require("./Outline"));
const Layout = ({ darkMode, toggleDarkMode, currentPath, isCurrentPathDirectory, handleFileSelect, handleDirectorySelect }) => {
    const [contentMode, setContentMode] = (0, react_1.useState)('fixed');
    const [fileTreeOpen, setFileTreeOpen] = (0, react_1.useState)(true); // ファイルツリーの開閉状態
    const [outlineOpen, setOutlineOpen] = (0, react_1.useState)(true); // アウトラインの開閉状態
    const [scrollToId, setScrollToId] = (0, react_1.useState)(null);
    const toggleFileTree = () => {
        setFileTreeOpen(!fileTreeOpen);
    };
    const toggleOutline = () => {
        setOutlineOpen(!outlineOpen);
    };
    const handleOutlineItemClick = (0, react_1.useCallback)((id) => {
        setScrollToId(id);
    }, []);
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', flexDirection: 'column', minHeight: '100vh' }, children: [(0, jsx_runtime_1.jsx)(material_1.AppBar, { position: "static", elevation: 0, sx: (theme) => ({ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}` }), children: (0, jsx_runtime_1.jsxs)(material_1.Toolbar, { children: [(0, jsx_runtime_1.jsx)(material_1.Box, { sx: { flexGrow: 1 }, children: (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleFileSelect(''), color: "inherit", children: (0, jsx_runtime_1.jsx)("img", { src: "/logo.svg", alt: "mdts logo", style: { height: '56px', marginLeft: '-36px' } }) }) }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => setContentMode(prevMode => prevMode === 'fixed' ? 'full' : 'fixed'), color: "inherit", sx: { mr: 2 }, children: contentMode === 'fixed' ? (0, jsx_runtime_1.jsx)(CropFree_1.default, {}) : (0, jsx_runtime_1.jsx)(Fullscreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { sx: { ml: 1 }, onClick: toggleDarkMode, color: "inherit", children: darkMode ? (0, jsx_runtime_1.jsx)(Brightness7_1.default, {}) : (0, jsx_runtime_1.jsx)(Brightness4_1.default, {}) })] }) }), (0, jsx_runtime_1.jsxs)(material_1.Box, { component: "main", sx: (theme) => ({ flexGrow: 1, display: 'flex', overflowY: 'auto' }), children: [(0, jsx_runtime_1.jsx)(FileTree_1.default, { onFileSelect: handleFileSelect, isOpen: fileTreeOpen, onToggle: toggleFileTree, selectedFilePath: currentPath }), currentPath && isCurrentPathDirectory ? ((0, jsx_runtime_1.jsx)(DirectoryContent_1.default, { selectedDirectoryPath: currentPath, onFileSelect: handleFileSelect, onDirectorySelect: handleDirectorySelect, contentMode: contentMode })) : ((0, jsx_runtime_1.jsx)(Content_1.default, { selectedFilePath: currentPath, onDirectorySelect: handleDirectorySelect, contentMode: contentMode, scrollToId: scrollToId })), (0, jsx_runtime_1.jsx)(Outline_1.default, { filePath: isCurrentPathDirectory ? null : currentPath, onItemClick: handleOutlineItemClick, isOpen: outlineOpen, onToggle: toggleOutline })] })] }));
};
exports.default = Layout;
