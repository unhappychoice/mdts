"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContent = void 0;
const react_1 = require("react");
const api_1 = require("../../api");
const useWebSocket_1 = require("../useWebSocket");
const useContent = (path) => {
    const [content, setContent] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const event = (0, useWebSocket_1.useWebSocket)();
    const getContent = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = path ? `/api/markdown/${path}` : '/api/markdown/mdts-welcome-markdown.md';
            const data = yield (0, api_1.fetchData)(url, 'text');
            setContent(data || '');
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        setLoading(true);
        getContent();
    }, [path]);
    (0, react_1.useEffect)(() => {
        if (event && event.type === 'reload-content' && path) {
            getContent();
        }
    }, [event]);
    return { content, loading, error };
};
exports.useContent = useContent;
