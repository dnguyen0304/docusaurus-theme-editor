import type {
    ThemeConfig,
    ThemeConfigValidationContext
} from '@docusaurus/types';
import { Joi } from '@docusaurus/utils-validation';

const DEFAULT_THEME_CONFIG = {
    githubAuthorizationRedirectUrl: 'https://kgevadn5a2.execute-api.us-east-1.amazonaws.com/production/DocusaurusEditor_handleOAuthRedirect',
};

// TODO(dnguyen0304): Investigate missing labels.
// TODO(dnguyen0304): Fix incorrect ThemeConfig type.
export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    editor: Joi.object({
        githubAuthorizationRedirectUrl:
            Joi.string().default(DEFAULT_THEME_CONFIG.githubAuthorizationRedirectUrl),
    })
        .label('themeConfig.editor')
        .default(DEFAULT_THEME_CONFIG),
});

export function validateThemeConfig({
    validate,
    themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
    return validate(ThemeConfigSchema, themeConfig);
}
