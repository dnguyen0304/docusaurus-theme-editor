import type { EditorThemeConfig } from '@docusaurus/theme-editor';
import type {
    ThemeConfig,
    ThemeConfigValidationContext
} from '@docusaurus/types';
import { Joi } from '@docusaurus/utils-validation';

const DEFAULT_THEME_CONFIG: EditorThemeConfig = {
    // TODO(dnguyen0304): Extract as a configuration setting.
    githubAuthorizationRedirectUrl: 'https://kgevadn5a2.execute-api.us-east-1.amazonaws.com/production/DocusaurusEditor_handleOAuthRedirect',
    swizzleIsEnabled: true,
};

// TODO(dnguyen0304): Investigate missing labels.
// TODO(dnguyen0304): Fix incorrect ThemeConfig type.
export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    docupotamusEditor: Joi.object({
        githubAuthorizationRedirectUrl: Joi
            .string()
            .default(DEFAULT_THEME_CONFIG.githubAuthorizationRedirectUrl),
        swizzleIsEnabled: Joi
            .boolean()
            .default(DEFAULT_THEME_CONFIG.swizzleIsEnabled),
    })
        .label('themeConfig.docupotamusEditor')
        .default(DEFAULT_THEME_CONFIG),
});

export const validateThemeConfig = ({
    validate,
    themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig => {
    return validate(ThemeConfigSchema, themeConfig);
};
