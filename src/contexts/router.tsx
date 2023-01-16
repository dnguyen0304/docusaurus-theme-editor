import { useLocation as useDocusaurusLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface ContextValue {
    readonly currentPath: string;
};

export const useLocation = (): ContextValue => {
    const {
        siteConfig: {
            trailingSlash,
        },
    } = useDocusaurusContext();
    const { pathname } = useDocusaurusLocation();

    return {
        currentPath: trailingSlash ? pathname.slice(0, -1) : pathname,
    };
};
