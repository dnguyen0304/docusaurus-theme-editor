import type { WrapperProps } from '@docusaurus/types';
import LayoutProvider from '@theme-init/Layout/Provider';
import type LayoutProviderType from '@theme/Layout/Provider';
import * as React from 'react';
import { DocMetadataProvider } from '../../../../contexts/docMetadata';

type Props = Readonly<WrapperProps<typeof LayoutProviderType>>;

export default function LayoutProviderWrapper(props: Props): JSX.Element {
    return (
        <DocMetadataProvider>
            {props.children} || <LayoutProvider {...props} />
        </DocMetadataProvider>
    );
};
