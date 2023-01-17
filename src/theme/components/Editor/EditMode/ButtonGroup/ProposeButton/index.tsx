import type {
    GithubPullStatus,
    KeyBinding as KeyBindingType
} from '@docusaurus/theme-editor';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { RequestError } from '@octokit/request-error';
import draft from 'draft-js';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEditor } from '../../../../../../contexts/editor';
import { useGithub } from '../../../../../../contexts/github';
import { useSite } from '../../../../../../contexts/site';
import { useSnackbar } from '../../../../../../contexts/snackbar';
import Transition from '../../../../../components/Transition';
import { initializeAuth } from '../../../../../services/Github';
import BaseStyledDialog from '../Dialog';
import LoadingButton from '../LoadingButton';

const TOOLTIP_DISABLED_TEXT: string =
    `Your pull request has been merged successfully. Hover over the tab name `
    + `for details.`;

type Props = {
    readonly closeEditor: () => void;
    readonly getMarkdown: (state?: draft.EditorState) => string;
    readonly saveMarkdown: (state?: draft.EditorState) => void;
    readonly pullStatus: GithubPullStatus | undefined;
}

const KeyBinding: KeyBindingType = {
    key: 'command+enter',
    friendlyLabel: '⌘↩︎',
};

const StyledDialog = styled(BaseStyledDialog)({
    '& div.MuiDialogContent-root': {
        // TODO(dnguyen0304): Migrate to theme.spacing.
        paddingTop: '1rem',
        '& p.MuiDialogContentText-root': {
            paddingBottom: '1rem',
        },
    },
});

// See https://stackoverflow.com/q/37949394
const StyledTextField = styled((props: TextFieldProps): JSX.Element => (
    <TextField inputRef={input => input && input.focus()} {...props} />
))(({ theme }) => ({
    '& label.MuiInputLabel-root': {
        fontStyle: 'italic',
    },
    '& div.MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
        },
    },
}));

export default function ProposeButton(
    {
        closeEditor,
        getMarkdown,
        saveMarkdown,
        pullStatus,
    }: Props
): JSX.Element {
    const {
        activeTabId,
        tabs,
    } = useEditor();
    const { snackbar } = useSnackbar();
    const githubContext = useGithub();
    const siteContext = useSite();

    const {
        pullTitle,
        pullUrl,
        pullBranchName,
        setPullTitle,
        setPullBranchName,
    } = tabs[activeTabId];

    const [confirmationIsOpen, setConfirmationIsOpen] =
        React.useState<boolean>(false);
    const [externalRedirect, setExternalRedirect] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const checkPullStatusTimerId = React.useRef<number>();

    const toggleConfirmation = () => {
        setConfirmationIsOpen(prev => !prev);
    };

    const handleClick = async () => {
        setIsLoading(true);
        // TODO(dnguyen0304): Investigate if an explicit save is required.
        saveMarkdown();

        const { setPullUrl } = tabs[activeTabId];

        // TODO(dnguyen0304): Fix duplicated auth code by decoupling
        // GithubContext and SiteContext.
        const {
            authRedirectUrl,
            github,
        } = await initializeAuth(
            githubContext,
            siteContext,
        );
        if (authRedirectUrl) {
            setExternalRedirect(authRedirectUrl);
            return;
        }
        if (!github) {
            throw new Error('expected Github service to be defined');
        }

        const branchName =
            `docusaurus-theme-editor`
            + `-${github.getUser().username}`
            + `-${Math.floor(Date.now() / 1000)}`
        await github.createBranch(branchName);
        setPullBranchName(branchName, true, siteContext);
        try {
            await github.createCommit(
                getMarkdown(),
                '[Auto-generated] [docusaurus-editor] Partial save.',
            );
        } catch (error) {
            if (error instanceof RequestError
                && error.status === 404
                && error.message.includes('No commit found for the ref')
            ) {
                snackbar.sendWarningAlert(
                    `Failed to propose changes. The local version is unchanged `
                    + `from the site version.`
                );
                setIsLoading(false);
                toggleConfirmation();
                return;
            } else {
                throw error;
            }
        }
        const pullUrl = await github.createPull(pullTitle);
        setPullUrl(pullUrl, true, siteContext);
        window.open(pullUrl, '_blank')!.focus();

        setIsLoading(false);

        // TODO(dnguyen0304): Add validation for pullTitle text field.
        // TODO(dnguyen0304): Investigate adding delay to wait for the
        // transition animation.
        snackbar.sendSuccessAlert(
            `Successfully proposed changes for "${pullTitle}".`
        );
        toggleConfirmation();
        closeEditor();
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPullTitle(event.target.value, true, siteContext);
    };

    const handleTitleKeyUp = (event: React.KeyboardEvent) => {
        // TODO(dnguyen0304): Add command+enter keyboard shortcut.
        if (event.key === 'Enter') {
            handleClick();
        }
    };

    // TODO(dnguyen0304): Add button loading animation or add centralized button
    // group loading animation.
    const getLabel = (pullUrl: string): string => {
        return pullUrl ? 'Sync' : 'Propose';
    }

    const syncLocalChanges = async () => {
        // TODO(dnguyen0304): Fix duplicated auth code by decoupling
        // GithubContext and SiteContext.
        const {
            authRedirectUrl,
            github,
        } = await initializeAuth(
            githubContext,
            siteContext,
        );
        if (authRedirectUrl) {
            setExternalRedirect(authRedirectUrl);
            return;
        }
        if (!github) {
            throw new Error('expected Github service to be defined');
        }

        await github.createCommit(
            getMarkdown(),
            '[Auto-generated] [docusaurus-editor] Partial save.',
            pullBranchName,
            pullUrl,
        );
    };

    const checkPullStatus = async () => {
        // TODO(dnguyen0304): Fix duplicated auth code by decoupling
        // GithubContext and SiteContext.
        const {
            authRedirectUrl,
            github,
        } = await initializeAuth(
            githubContext,
            siteContext,
        );
        if (authRedirectUrl) {
            setExternalRedirect(authRedirectUrl);
            return;
        }
        if (!github) {
            throw new Error('expected Github service to be defined');
        }

        const { setPullStatus } = tabs[activeTabId];
        const status = await github.checkPullStatus(pullUrl);
        setPullStatus(status);
    };

    useHotkeys(
        KeyBinding.key,
        pullUrl
            ? syncLocalChanges
            : toggleConfirmation,
    );

    React.useEffect(() => {
        if (!pullUrl) {
            return;
        }

        checkPullStatus();
        checkPullStatusTimerId.current = window.setInterval(async () => {
            await checkPullStatus();
        }, 60 * 1000);

        return () => {
            clearTimeout(checkPullStatusTimerId.current);
        };
    }, [pullUrl]);

    React.useEffect(() => {
        if (externalRedirect) {
            window.location.replace(externalRedirect);
        }
    }, [externalRedirect]);

    return (
        <>
            <Tooltip
                title={
                    pullStatus && pullStatus.state === 'merged'
                        ? TOOLTIP_DISABLED_TEXT
                        : `${getLabel(pullUrl)} (${KeyBinding.friendlyLabel})`
                }
                placement='top'
            >
                {/* Use a wrapper element for disabled Tooltip children. */}
                <span>
                    <Button
                        disabled={pullStatus && pullStatus.state === 'merged'}
                        onClick={
                            pullUrl
                                ? syncLocalChanges
                                : toggleConfirmation
                        }
                        startIcon={
                            pullUrl
                                ? <CloudUploadOutlinedIcon />
                                : <SendIcon />
                        }
                        variant='contained'
                    >
                        {getLabel(pullUrl)}
                    </Button>
                </span>
            </Tooltip>
            {/* TODO(dnguyen0304): Fix dark mode color styles. */}
            <StyledDialog
                TransitionComponent={Transition}
                onClose={toggleConfirmation}
                open={confirmationIsOpen}
                keepMounted
            >
                <DialogTitle>Propose Changes</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <DialogContentText>
                            Provide a short, helpful background of your
                            changes.
                            <br /><br />
                            This opens a pull request to get your changes
                            reviewed by the documentation owners.
                        </DialogContentText>
                        <StyledTextField
                            autoComplete={'off'}
                            helperText={<>Press <kbd>↩︎ Enter</kbd> to send</>}
                            label='Title'
                            onChange={handleTitleChange}
                            onKeyUp={handleTitleKeyUp}
                            value={pullTitle}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleConfirmation}>Go Back</Button>
                    <LoadingButton
                        onClick={handleClick}
                        isLoading={isLoading}
                        variant='outlined'
                    >
                        Propose
                    </LoadingButton>
                </DialogActions>
            </StyledDialog>
        </>
    );
}
