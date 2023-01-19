import type { WrapperProps } from '@docusaurus/types';
import DesktopInit from '@theme-init/DocItem/TOC/Desktop';
import type DesktopType from '@theme/DocItem/TOC/Desktop';
import * as React from 'react';
import { useEditorThemeConfig } from '../../../../utils';
import DesktopSwizzle from '../../../docupotamus-editor/DocItem/TOC/Desktop';

type Props = Readonly<WrapperProps<typeof DesktopType>>;

export default function DesktopWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useEditorThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <DesktopSwizzle {...props} />
            : <DesktopInit {...props} />
    );
};
