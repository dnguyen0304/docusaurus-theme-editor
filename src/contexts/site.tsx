import URI from 'urijs';
import { DOCUSAURUS_ALIASED_SITE_PATH_PREFIX } from '../constants';
import { useDocMetadata } from './docMetadata';

export interface ContextValue {
    readonly owner: string;
    readonly repository: string;
    readonly path: string;
};

export const useSite = (): ContextValue => {
    const { editUrl, source } = useDocMetadata();

    const [siteOwner, siteRepository] = new URI(editUrl ?? '').segment();

    return {
        owner: siteOwner,
        repository: siteRepository,
        path: source.replace(`${DOCUSAURUS_ALIASED_SITE_PATH_PREFIX}/`, ''),
    };
};
