import type { WrapperProps } from '@docusaurus/types';
import LayoutProviderInit from '@theme-init/Layout/Provider';
import type LayoutProviderType from '@theme/Layout/Provider';
import * as React from 'react';
import { useEditorThemeConfig } from '../../../utils';
import LayoutProviderSwizzle from '../../docupotamus-editor/Layout/Provider';

type Props = Readonly<WrapperProps<typeof LayoutProviderType>>;

export default function LayoutProviderWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useEditorThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <LayoutProviderSwizzle {...props} />
            : <LayoutProviderInit {...props} />
    );
};
