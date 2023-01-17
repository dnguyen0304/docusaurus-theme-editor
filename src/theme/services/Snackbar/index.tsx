// TODO(dnguyen0304): Investigate why moving this module to src/services
// throws "ReferenceError: exports is not defined".

import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import MuiSnackbar from '@mui/material/Snackbar';
import * as React from 'react';

export interface SnackbarType {
    readonly create: () => JSX.Element;
    readonly sendAlert: (
        severity: AlertColor,
        content: React.ReactNode,
        durationUpdater: (prev: number) => number,
    ) => void;
    readonly sendSuccessAlert: (
        content: React.ReactNode,
        durationUpdater?: (prev: number) => number,
    ) => void;
    readonly sendWarningAlert: (
        content: React.ReactNode,
        durationUpdater?: (prev: number) => number,
    ) => void;
};

// Copied from:
// https://mui.com/material-ui/react-snackbar/#customization
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props: AlertProps,
    ref: React.Ref<HTMLDivElement>,
) {
    return (
        <MuiAlert
            ref={ref}
            elevation={6}
            {...props}
        />
    );
});

export default function Snackbar(): SnackbarType {
    // TODO(dnguyen0304): Investigate why this does not violate the "Only Call
    // Hooks from React Functions" rule.
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [content, setContent] =
        React.useState<JSX.Element | undefined>(undefined);
    const [duration, setDuration] =
        React.useState<number>(10 * 1000);  // 10 seconds in milliseconds

    const create = (): JSX.Element => {
        return (
            <MuiSnackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                // TODO(dnguyen0304): Extract as a configuration option.
                autoHideDuration={duration}
                onClose={close}
                open={isOpen}
                sx={{
                    left: 24,
                    bottom: 20,
                    // Prevent the snackbar, with its high z-index, blocking
                    // users from interacting with elements beneath it.
                    width: 'fit-content'
                }}
            >
                {content}
            </MuiSnackbar>
        );
    };

    const open = (content: JSX.Element) => {
        setContent(content);
        setIsOpen(true);
    };

    const close = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            // Do nothing.
            return;
        }
        setIsOpen(false);
    };

    const sendAlert = (
        severity: AlertColor,
        content: React.ReactNode,
        durationUpdater: (prev: number) => number,
    ) => {
        const previousDuration = duration;
        setDuration(durationUpdater);
        open(
            <Alert severity={severity} onClose={close}>
                {content}
            </Alert>
        );
        setDuration(previousDuration);
    };

    const sendSuccessAlert = (
        content: React.ReactNode,
        durationUpdater: (prev: number) => number = noOpUpdater,
    ) => {
        sendAlert('success', content, durationUpdater);
    };

    const sendWarningAlert = (
        content: React.ReactNode,
        durationUpdater: (prev: number) => number = noOpUpdater,
    ) => {
        sendAlert('warning', content, durationUpdater);
    };

    const noOpUpdater = (prev: number): number => {
        return prev;
    };

    return {
        create: create,
        sendAlert: sendAlert,
        sendSuccessAlert: sendSuccessAlert,
        sendWarningAlert: sendWarningAlert,
    };
};
