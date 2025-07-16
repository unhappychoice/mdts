"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFileTreeContext = exports.FileTreeProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useFileTree_1 = require("../hooks/apis/useFileTree");
const FileTreeContext = (0, react_1.createContext)(undefined);
const FileTreeProvider = ({ children }) => {
    const { fileTree, loading, error } = (0, useFileTree_1.useFileTree)(); // useFileTree will now fetch the full tree
    return ((0, jsx_runtime_1.jsx)(FileTreeContext.Provider, { value: { fileTree, loading, error }, children: children }));
};
exports.FileTreeProvider = FileTreeProvider;
const useFileTreeContext = () => {
    const context = (0, react_1.useContext)(FileTreeContext);
    if (context === undefined) {
        throw new Error('useFileTreeContext must be used within a FileTreeProvider');
    }
    return context;
};
exports.useFileTreeContext = useFileTreeContext;
