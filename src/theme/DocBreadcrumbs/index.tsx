import type { WrapperProps } from '@docusaurus/types';
import DocBreadcrumbsInit from '@theme-init/DocBreadcrumbs';
import type DocBreadcrumbsType from '@theme/DocBreadcrumbs';
import * as React from 'react';
import { useEditorThemeConfig } from '../../utils';
import DocBreadcrumbsSwizzle from '../docupotamus-editor/DocBreadcrumbs';

type Props = Readonly<WrapperProps<typeof DocBreadcrumbsType>>;

export default function DocBreadcrumbsWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useEditorThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <DocBreadcrumbsSwizzle {...props} />
            : <DocBreadcrumbsInit {...props} />
    );
};
