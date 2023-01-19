import type { WrapperProps } from '@docusaurus/types';
import DocPageInit from '@theme-init/DocPage';
import type DocPageType from '@theme/DocPage';
import * as React from 'react';
import { useEditorThemeConfig } from '../../utils';
import DocPageSwizzle from '../docupotamus-editor/DocPage';

type Props = Readonly<WrapperProps<typeof DocPageType>>;

export default function DocPageWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useEditorThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <DocPageSwizzle {...props} />
            : <DocPageInit {...props} />
    );
};
