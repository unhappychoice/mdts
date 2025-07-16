"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ChevronLeft_1 = __importDefault(require("@mui/icons-material/ChevronLeft"));
const ChevronRight_1 = __importDefault(require("@mui/icons-material/ChevronRight"));
const material_1 = require("@mui/material");
const useOutline_1 = require("../hooks/apis/useOutline");
const Outline = ({ filePath, onItemClick, isOpen, onToggle }) => {
    const { outline, loading, error } = (0, useOutline_1.useOutline)(filePath);
    if (error)
        return (0, jsx_runtime_1.jsxs)("p", { children: ["Error: ", error] });
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
            width: isOpen ? '300px' : '66px',
            bgcolor: 'background.paper',
            p: isOpen ? 2 : 0.5, // Adjust padding when closed
            borderLeft: '1px solid',
            borderColor: 'divider',
            minHeight: '100%',
            flexShrink: 0,
        }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '34px', marginTop: isOpen ? '0' : '16px', marginBottom: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: onToggle, size: "small", sx: { marginBottom: 0, marginLeft: isOpen ? '0' : '12px' }, children: isOpen ? (0, jsx_runtime_1.jsx)(ChevronRight_1.default, {}) : (0, jsx_runtime_1.jsx)(ChevronLeft_1.default, {}) }), isOpen && ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, sx: { marginLeft: 1, marginBottom: 0 }, children: "Outline" }))] }), isOpen && (loading ? ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) })) : ((0, jsx_runtime_1.jsx)(material_1.List, { dense: true, children: outline.map((item, index) => ((0, jsx_runtime_1.jsx)(material_1.ListItem, { button: true, sx: { pl: item.level * 2 }, onClick: () => onItemClick(item.id), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: item.content, sx: {
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        } }) }, item.id))) })))] }));
};
exports.default = Outline;
