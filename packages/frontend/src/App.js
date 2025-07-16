"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = require("react");
const Layout_1 = __importDefault(require("./components/Layout"));
const useFileTree_1 = require("./hooks/apis/useFileTree");
const App = () => {
    const isDarkMode = (0, material_1.useMediaQuery)('(prefers-color-scheme: dark)');
    const [darkMode, setDarkMode] = (0, react_1.useState)(isDarkMode);
    const [currentPath, setCurrentPath] = (0, react_1.useState)(null);
    const [isCurrentPathDirectory, setIsCurrentPathDirectory] = (0, react_1.useState)(false);
    const { loading } = (0, useFileTree_1.useFileTree)();
    (0, react_1.useEffect)(() => {
        const getPathFromUrl = () => {
            const path = window.location.pathname.substring(1);
            if (path === '')
                return { path: null, isDirectory: false };
            const fileExtensions = ['.md', '.markdown'];
            const isFile = fileExtensions.some(ext => path.toLowerCase().endsWith(ext));
            return { path: decodeURIComponent(path), isDirectory: !isFile };
        };
        const { path, isDirectory } = getPathFromUrl();
        setCurrentPath(path);
        setIsCurrentPathDirectory(isDirectory);
        const handlePopState = () => {
            const { path: popPath, isDirectory: popIsDirectory } = getPathFromUrl();
            setCurrentPath(popPath);
            setIsCurrentPathDirectory(popIsDirectory);
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [currentPath]);
    const handleFileSelect = (path) => {
        setCurrentPath(path);
        setIsCurrentPathDirectory(false);
        window.history.pushState({ path: path }, '', `/${path}`);
    };
    const handleDirectorySelect = (path) => {
        setCurrentPath(path);
        setIsCurrentPathDirectory(true);
        window.history.pushState({ path: path }, '', `/${path}`);
    };
    const theme = (0, react_1.useMemo)(() => (0, material_1.createTheme)({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#1976d2',
                light: '#1976d2',
                dark: '#1976d2',
            },
            background: {
                default: darkMode ? '#161819' : '#f4f5f7',
                paper: darkMode ? '#0f1214' : '#ffffff',
            },
        },
    }), [darkMode]);
    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.ThemeProvider, { theme: theme, children: [(0, jsx_runtime_1.jsx)(material_1.CssBaseline, {}), (0, jsx_runtime_1.jsx)(Layout_1.default, { darkMode: darkMode, toggleDarkMode: toggleDarkMode, currentPath: currentPath, isCurrentPathDirectory: isCurrentPathDirectory, handleFileSelect: handleFileSelect, handleDirectorySelect: handleDirectorySelect })] }));
};
exports.default = App;
