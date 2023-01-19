import type { WrapperProps } from '@docusaurus/types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import type DocBreadcrumbsType from '@theme/DocBreadcrumbs';
import * as React from 'react';
import { useEditor } from '../../../contexts/editor';
import { useRawContent } from '../../../contexts/rawContent';
import { useLocation } from '../../../contexts/router';
import CloseButton from '../../docupotamus-editor/components/CloseButton';
import EditButton from '../../docupotamus-editor/components/EditButton';
import styles from './styles.module.css';

type Props = WrapperProps<typeof DocBreadcrumbsType>;

const Button = (): JSX.Element | null => {
    const { editorIsOpen, setEditorIsOpen } = useEditor();
    const { currentPath } = useLocation();
    const { rawContent } = useRawContent();

    const toggleEditorIsOpen = () => setEditorIsOpen(prev => !prev);

    if (currentPath in rawContent === false) {
        return null;
    }
    if (!editorIsOpen) {
        return <EditButton onClick={toggleEditorIsOpen} />;
    }
    return <CloseButton toggleEditorIsOpen={toggleEditorIsOpen} />;
};

export default function DocBreadcrumbsWrapper(props: Props): JSX.Element {
    const theme = useTheme();
    const isLargerThanMobile = useMediaQuery(theme.breakpoints.up('mobile'));

    return (
        <nav className={`${styles.breadcrumbsWrapper_container}`}>
            <DocBreadcrumbs {...props} />
            {isLargerThanMobile && <Button />}
        </nav>
    );
};
