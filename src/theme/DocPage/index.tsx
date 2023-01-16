import type { WrapperProps } from '@docusaurus/types';
import type DocPageType from '@theme-init/DocPage';
import DocPage from '@theme-init/DocPage';
import * as React from 'react';
import { RawContentProvider } from '../../contexts/rawContent';

type Props = WrapperProps<typeof DocPageType>;

export default function DocPageWrapper(props: Props): JSX.Element {
    const { rawContent } = props;

    return (
        <RawContentProvider rawContent={rawContent}>
            <DocPage {...props} />
        </RawContentProvider>
    );
};
