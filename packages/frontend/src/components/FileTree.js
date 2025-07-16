"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_material_1 = require("@mui/icons-material");
const ChevronLeft_1 = __importDefault(require("@mui/icons-material/ChevronLeft"));
const ChevronRight_1 = __importDefault(require("@mui/icons-material/ChevronRight"));
const Description_1 = __importDefault(require("@mui/icons-material/Description"));
const ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
const UnfoldLess_1 = __importDefault(require("@mui/icons-material/UnfoldLess"));
const UnfoldMore_1 = __importDefault(require("@mui/icons-material/UnfoldMore"));
const material_1 = require("@mui/material");
const x_tree_view_1 = require("@mui/x-tree-view");
const SimpleTreeView_1 = require("@mui/x-tree-view/SimpleTreeView");
const react_1 = __importDefault(require("react"));
const useFileTree_1 = require("../hooks/apis/useFileTree");
const renderTreeItems = (tree, onFileSelect, parentPath = '') => {
    return tree.map((item) => {
        if (typeof item === 'string') {
            const fileName = item.split('/').pop();
            return ((0, jsx_runtime_1.jsx)(x_tree_view_1.TreeItem, { itemId: item, label: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { fontSize: '0.875rem' }, children: fileName }), icon: (0, jsx_runtime_1.jsx)(Description_1.default, { fontSize: "small" }), onClick: () => onFileSelect(item) }, item));
        }
        else {
            const key = Object.keys(item)[0];
            const value = item[key];
            const currentPath = parentPath ? `${parentPath}/${key}` : key;
            return ((0, jsx_runtime_1.jsx)(x_tree_view_1.TreeItem, { itemId: currentPath, label: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(icons_material_1.FolderOutlined, { sx: { mr: 1, fontSize: 'small' }, color: "primary" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { fontSize: '0.875rem' }, children: key })] }), children: Array.isArray(value) && renderTreeItems(value, onFileSelect, currentPath) }, currentPath));
        }
    });
};
const FileTree = ({ onFileSelect, isOpen, onToggle, selectedFilePath }) => {
    const { fileTree, loading, error } = (0, useFileTree_1.useFileTree)();
    const [expanded, setExpanded] = react_1.default.useState([]);
    const handleExpandAll = () => {
        const allItemIds = [];
        const collectIds = (items, parentPath = '') => {
            items.forEach(item => {
                if (typeof item !== 'string') {
                    const key = Object.keys(item)[0];
                    const currentPath = parentPath ? `${parentPath}/${key}` : key;
                    allItemIds.push(currentPath);
                    collectIds(item[key], currentPath);
                }
            });
        };
        if (fileTree) {
            collectIds(fileTree);
        }
        setExpanded(allItemIds);
    };
    const handleCollapseAll = () => {
        setExpanded([]);
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
            width: isOpen ? '300px' : '66px',
            bgcolor: 'background.paper',
            p: isOpen ? 2 : 0.5,
            borderRight: '1px solid',
            borderColor: 'divider',
            minHeight: '100%',
            flexShrink: 0,
        }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '34px', marginTop: isOpen ? '0' : '16px', marginBottom: 2 }, children: [isOpen && ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', flex: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, sx: { flex: 1, marginLeft: 1, marginBottom: 0 }, children: "File Tree" }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: handleExpandAll, size: "small", "aria-label": "expand all", children: (0, jsx_runtime_1.jsx)(UnfoldMore_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: handleCollapseAll, size: "small", "aria-label": "collapse all", children: (0, jsx_runtime_1.jsx)(UnfoldLess_1.default, {}) })] })), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: onToggle, size: "small", sx: { marginBottom: 0, marginLeft: isOpen ? '0' : '12px' }, children: isOpen ? (0, jsx_runtime_1.jsx)(ChevronLeft_1.default, {}) : (0, jsx_runtime_1.jsx)(ChevronRight_1.default, {}) })] }), isOpen && (loading ? ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) })) : error ? ((0, jsx_runtime_1.jsxs)(material_1.Typography, { color: "error", children: ["Error: ", error] })) : ((0, jsx_runtime_1.jsx)(SimpleTreeView_1.SimpleTreeView, { defaultCollapseIcon: (0, jsx_runtime_1.jsx)(ExpandMore_1.default, {}), defaultExpandIcon: (0, jsx_runtime_1.jsx)(ChevronRight_1.default, {}), expandedItems: expanded, onExpandedItemsChange: (event, itemIds) => setExpanded(itemIds), sx: { flexGrow: 1, maxWidth: 400, overflowY: 'auto' }, children: renderTreeItems(fileTree, onFileSelect) })))] }));
};
exports.default = FileTree;
