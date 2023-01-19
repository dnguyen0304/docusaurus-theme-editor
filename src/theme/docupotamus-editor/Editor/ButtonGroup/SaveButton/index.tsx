import type {
    GithubPullStatus,
    KeyBinding as KeyBindingType
} from '@docusaurus/theme-editor';
import DoneIcon from '@mui/icons-material/Done';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import draft from 'draft-js';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSnackbar } from '../../../../../contexts/snackbar';

const TOOLTIP_DISABLED_TEXT: string =
    `Your pull request has been merged successfully. Hover over the tab name `
    + `for details.`;

type Props = {
    readonly onClick: (state?: draft.EditorState) => void;
    readonly editorState: draft.EditorState;
    readonly pullStatus: GithubPullStatus | undefined;
}

const KeyBinding: KeyBindingType = {
    key: 'shift+option+s',
    friendlyLabel: '^⌥S',
};

// TODO(dnguyen0304): Fix memory leak on closing the editor while still saving.
export default function SaveButton(
    {
        onClick,
        editorState,
        pullStatus,
    }: Props
): JSX.Element {
    const { snackbar } = useSnackbar();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
    const backgroundSaveTimerId = React.useRef<number>();
    const doneIconTimerId = React.useRef<number>();

    const handleClick = (shouldAlert: boolean) => {
        setIsSaving(true);
        // TODO(dnguyen0304): Investigate if an explicit save is required.
        onClick();
        new Promise(resolve => setTimeout(resolve, 2500))
            .then(() => {
                setIsSaving(false);
                setIsConfirmed(true);
                if (shouldAlert) {
                    snackbar.sendSuccessAlert('Successfully saved changes.');
                }
            })
            .then(() => {
                doneIconTimerId.current = window.setTimeout(() => {
                    setIsConfirmed(false);
                }, 1250);
            });
    };

    const getIcon = (): JSX.Element => {
        if (isConfirmed) {
            return <DoneIcon color='primary' />;
        } else if (isSaving) {
            // All components must have the same dimensions (size) to avoid
            // visual studdering.
            return <CircularProgress size={24} />;
        } else {
            return <SaveOutlinedIcon sx={{ color: 'var(--ifm-color-emphasis-700)' }} />;
        };
    };

    useHotkeys(
        KeyBinding.key,
        () => handleClick(
            true  // shouldAlert
        ),
        [editorState],
    );

    React.useEffect(() => {
        backgroundSaveTimerId.current = window.setInterval(() => {
            handleClick(
                false  // shouldAlert
            );
        }, 60 * 1000);

        return () => {
            clearTimeout(backgroundSaveTimerId.current);
            clearTimeout(doneIconTimerId.current);
        };
    }, [editorState]);

    return (
        <Tooltip
            title={
                pullStatus && pullStatus.state === 'merged'
                    ? TOOLTIP_DISABLED_TEXT
                    : `Save (${KeyBinding.friendlyLabel})`
            }
            placement='top'
        >
            {/* Use a wrapper element for disabled Tooltip children. */}
            <span>
                <IconButton
                    aria-label='save'
                    disabled={pullStatus && pullStatus.state === 'merged'}
                    onClick={() => handleClick(
                        true  // shouldAlert
                    )}
                >
                    {getIcon()}
                </IconButton>
            </span>
        </Tooltip>
    );
}
