// TODO(dnguyen0304): Investigate referencing @docusaurus/module-type-aliases.
/// <reference types="@docusaurus/theme-classic" />

declare module '@docusaurus/theme-editor' {
    type EditorThemeConfig = {
        githubAuthorizationRedirectUrl: string;
    };

    type DocupotamusThemeConfig = {
        readTime: {
            contentRootSelector: string;
            contentSelector: string;
            debug: {
                band: {
                    isEnabled: boolean;
                    colors: string[];
                };
                border: {
                    isEnabled: boolean;
                };
            };
        };
    };

    type KeyBinding = {
        readonly key: string;
        readonly friendlyLabel: string;
    }

    type GithubUser = {
        readonly username: string;
        readonly emailAddress?: string;
        readonly fullName?: string;
    }

    // TODO(dnguyen0304): Consider adding a null option to represent a pull request
    // does not exist.
    type InternalGithubState = 'open' | 'closed' | 'merged';

    type GithubPullStatus = {
        readonly state: InternalGithubState;
        // Gotcha: When a pull request is closed, both closedAt and mergedAt are
        // updated. Therefore, mergedAt must be directly checked to determine if a
        // pull request has been merged.
        readonly closedAt: string | null;
        readonly mergedAt: string | null;
    }

    type LOCAL_STORAGE_KEYS =
        | 'markdown'
        | 'pull_branch_name'
        | 'pull_title'
        | 'pull_url';
}
