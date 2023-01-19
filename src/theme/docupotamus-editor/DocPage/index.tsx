import type { WrapperProps } from '@docusaurus/types';
import DocPage from '@theme-original/DocPage';
import type DocPageType from '@theme/DocPage';
import * as React from 'react';
import { RawContentProvider } from '../../../contexts/rawContent';

type Props = WrapperProps<typeof DocPageType>;

export default function DocPageWrapper(props: Props): JSX.Element {
    // TODO(dnguyen0304): Fix type declaration.
    const { rawContent } = props;

    return (
        <RawContentProvider rawContent={rawContent}>
            <DocPage {...props} />
        </RawContentProvider>
    );
};
