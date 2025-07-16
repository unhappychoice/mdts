"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_material_1 = require("@mui/icons-material");
const material_1 = require("@mui/material");
const FileTreeContext_1 = require("../contexts/FileTreeContext");
const filterFileTree = (tree, targetPath) => {
    if (targetPath === '') {
        const result = [];
        tree.forEach(item => {
            if (typeof item === 'string') {
                result.push(item.split('/').pop() || item);
            }
            else {
                const key = Object.keys(item)[0];
                const newObject = {};
                newObject[key.split('/').pop() || key] = item[key];
                result.push(newObject);
            }
        });
        return result;
    }
    const findChildren = (currentTree, pathSegments, currentSegmentIndex) => {
        if (currentSegmentIndex === pathSegments.length) {
            return currentTree;
        }
        const segment = pathSegments[currentSegmentIndex];
        for (const item of currentTree) {
            if (typeof item !== 'string') {
                const key = Object.keys(item)[0];
                const itemSegments = key.split('/');
                if (itemSegments[itemSegments.length - 1] === segment) {
                    const children = item[key];
                    if (Array.isArray(children)) {
                        return findChildren(children, pathSegments, currentSegmentIndex + 1);
                    }
                }
            }
        }
        return null;
    };
    const pathSegments = targetPath.split('/').filter(s => s !== '');
    const children = findChildren(tree, pathSegments, 0);
    if (children) {
        const result = [];
        children.forEach(item => {
            if (typeof item === 'string') {
                result.push(item.split('/').pop() || item);
            }
            else {
                const key = Object.keys(item)[0];
                const newObject = {};
                newObject[key.split('/').pop() || key] = item[key];
                result.push(newObject);
            }
        });
        return result;
    }
    return [];
};
const DirectoryContent = ({ selectedDirectoryPath, onFileSelect, onDirectorySelect, contentMode = 'fixed' }) => {
    const { fileTree: fullFileTree, loading, error } = (0, FileTreeContext_1.useFileTreeContext)();
    const fileTree = filterFileTree(fullFileTree, selectedDirectoryPath);
    const pathSegments = selectedDirectoryPath
        ? selectedDirectoryPath.split('/').filter(segment => segment !== '')
        : [];
    if (error)
        return (0, jsx_runtime_1.jsxs)("p", { children: ["Error: ", error] });
    const handleItemClick = (itemPath, isDirectory) => {
        if (isDirectory) {
            onDirectorySelect(itemPath);
        }
        else {
            onFileSelect(itemPath);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: Object.assign({ flexGrow: 1, p: 4, bgcolor: 'background.paper' }, (contentMode === 'fixed' && {
            maxWidth: '800px',
            margin: '0 auto',
        })), children: [selectedDirectoryPath && ((0, jsx_runtime_1.jsx)(material_1.Breadcrumbs, { "aria-label": "breadcrumb", sx: { mb: 4 }, children: pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const path = pathSegments.slice(0, index + 1).join('/');
                    return isLast ? ((0, jsx_runtime_1.jsx)(material_1.Typography, { color: "text.primary", children: segment }, path)) : ((0, jsx_runtime_1.jsx)(material_1.Link, { color: "inherit", href: "#", onClick: () => onDirectorySelect && onDirectorySelect(path), children: segment }, path));
                }) })), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', mb: 8 }, children: [(0, jsx_runtime_1.jsx)(icons_material_1.FolderOutlined, { sx: { mr: 2 }, color: "primary", fontSize: "large" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, sx: { mb: 0 }, children: selectedDirectoryPath })] }), (0, jsx_runtime_1.jsx)(material_1.Divider, { sx: { paddingLeft: '24px', marginLeft: '-32px', marginRight: '-32px', borderBottom: 1, borderColor: 'divider' } }), loading && ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) })), (0, jsx_runtime_1.jsx)(material_1.Box, { mt: 4, children: fileTree && ((0, jsx_runtime_1.jsx)(material_1.List, { sx: { mr: -2, ml: -2 }, children: fileTree.map((item) => {
                        let name;
                        let itemPath;
                        let isDirectory;
                        if (typeof item === 'string') {
                            // It's a file
                            name = item;
                            itemPath = selectedDirectoryPath === '' ? item : `${selectedDirectoryPath}/${item}`;
                            isDirectory = false;
                        }
                        else {
                            // It's a directory object { [key: string]: FileTreeItem[] | string; }
                            const key = Object.keys(item)[0];
                            name = key;
                            itemPath = selectedDirectoryPath === '' ? key : `${selectedDirectoryPath}/${key}`;
                            isDirectory = true;
                        }
                        return ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { button: true, onClick: () => handleItemClick(itemPath, isDirectory), children: [(0, jsx_runtime_1.jsx)(material_1.ListItemIcon, { sx: { minWidth: "38px" }, children: isDirectory ? (0, jsx_runtime_1.jsx)(icons_material_1.FolderOutlined, { color: "primary" }) : (0, jsx_runtime_1.jsx)(icons_material_1.ArticleOutlined, {}) }), (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: name })] }, itemPath));
                    }) })) })] }));
};
exports.default = DirectoryContent;
