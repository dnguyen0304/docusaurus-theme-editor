import { useDoc } from '@docusaurus/theme-common/internal';
import type { WrapperProps } from '@docusaurus/types';
import Layout from '@theme-init/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import * as React from 'react';
import {
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL
} from '../../../../constants';
import { useDocMetadata } from '../../../../contexts/docMetadata';
import { useEditor } from '../../../../contexts/editor';
import { useSite } from '../../../../contexts/site';
import { getLocalStorageKey } from '../../../../utils';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
    const {
        tabs,
        addTab,
    } = useEditor();
    // TODO(dnguyen0304): Add custom hook for increasing context scope.
    const { setEditUrl, setSource } = useDocMetadata();
    const {
        metadata: {
            editUrl,
            source,
        },
    } = useDoc();
    const siteContext = useSite();

    React.useEffect(() => {
        setEditUrl(editUrl);
        setSource(source);
    }, [editUrl, source]);

    React.useEffect(() => {
        const pullTitle =
            localStorage.getItem(
                getLocalStorageKey(
                    siteContext,
                    LOCAL_STORAGE_KEY_PULL_TITLE));
        const pullUrl =
            localStorage.getItem(
                getLocalStorageKey(
                    siteContext,
                    LOCAL_STORAGE_KEY_PULL_URL));
        const pullBranchName =
            localStorage.getItem(
                getLocalStorageKey(
                    siteContext,
                    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME));
        if (tabs.length === 0) {
            // TODO(dnguyen0304): Investigate if the empty string fallback is
            // necessary.
            addTab({
                pullTitle: pullTitle ?? '',
                pullUrl: pullUrl ?? '',
                pullBranchName: pullBranchName ?? '',
            });
        }
    }, []);

    React.useEffect(() => {
        document
            .querySelector(`main[class*='docMainContainer']`)
            ?.classList
            .add('editorDocItemContainer');

        return () =>
            document
                .querySelector(`main[class*='docMainContainer']`)
                ?.classList
                .remove('editorDocItemContainer');
    }, []);

    return (
        <Layout {...props} />
    );
};
