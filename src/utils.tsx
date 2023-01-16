import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ContextValue } from './contexts/site';
import type {
    EditorThemeConfig,
    LOCAL_STORAGE_KEYS
} from './docusaurus-theme-editor';

export const useEditorThemeConfig = (): EditorThemeConfig => {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .docupotamusEditor
    ) as EditorThemeConfig;
};

export const getLocalStorageKey = (
    {
        owner,
        repository,
        path,
    }: ContextValue,
    key: LOCAL_STORAGE_KEYS,
): string => {
    return `${owner}/${repository}/${path}/${key}`;
};
