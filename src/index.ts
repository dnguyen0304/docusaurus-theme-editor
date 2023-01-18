import type { Plugin } from '@docusaurus/types';

export default function themeEditor(): Plugin<undefined> {
    return {
        name: 'docusaurus-theme-editor',

        getThemePath() {
            return '../lib/theme';
        },

        getTypeScriptThemePath() {
            return '../src/theme';
        },
    };
};

export { validateThemeConfig } from './validateThemeConfig';

export const getSwizzleComponentList = (): string[] => [];
