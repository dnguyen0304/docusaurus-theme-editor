import type { KeyBinding } from '@docusaurus/theme-editor';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export const CloseButtonKeyBinding: KeyBinding = {
    key: 'escape',
    friendlyLabel: 'esc',
};

// TODO(dnguyen0304): Fix duplicated definition.
const COLOR_GREY_400: string = '#8996a5';

const StyledButton = styled(Button)({
    color: COLOR_GREY_400,
});

interface Props {
    readonly toggleEditorIsOpen: () => void;
};

export default function CloseButton(
    {
        toggleEditorIsOpen,
    }: Props
): JSX.Element {
    useHotkeys(
        CloseButtonKeyBinding.key,
        toggleEditorIsOpen,
    );

    return (
        <Tooltip
            title={`Close editor panel (${CloseButtonKeyBinding.friendlyLabel})`}
            placement='bottom'
        >
            <StyledButton
                onClick={toggleEditorIsOpen}
                startIcon={<CloseIcon />}
                variant='outlined'
            >
                Close
            </StyledButton>
        </Tooltip>
    );
};
