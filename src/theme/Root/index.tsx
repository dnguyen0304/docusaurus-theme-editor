import type { WrapperProps } from '@docusaurus/types';
import RootInit from '@theme-init/Root';
import type RootType from '@theme/Root';
import * as React from 'react';
import { useEditorThemeConfig } from '../../utils';
import RootSwizzle from '../docupotamus-editor/Root';

type Props = Readonly<WrapperProps<typeof RootType>>;

export default function RootWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useEditorThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <RootSwizzle {...props} />
            : <RootInit {...props} />
    );
};
