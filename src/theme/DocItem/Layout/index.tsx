import type { WrapperProps } from '@docusaurus/types';
import LayoutInit from '@theme-init/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import * as React from 'react';
import { useEditorThemeConfig } from '../../../utils';
import LayoutSwizzle from '../../docupotamus-editor/DocItem/Layout';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useEditorThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <LayoutSwizzle {...props} />
            : <LayoutInit {...props} />
    );
};
