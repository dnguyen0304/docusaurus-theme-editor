import styled from '@emotion/styled';
import MergeIcon from '@mui/icons-material/Merge';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { PullType, useEditor } from '../../contexts/editor';
import EditorContainer from './Container';
import EditorTab from './Tab';

type iconFontSize = 'small' | 'inherit' | 'large' | 'medium' | undefined;

interface TabLabelProps {
    pull: PullType | undefined;
    pullRequestUrl: string;
}

interface TabContentProps {
    index: number,
    activeIndex: number,
}

const StyledTabs = styled(Tabs)(({ theme, pull }) => ({
    '.MuiTouchRipple-child': {
        backgroundColor: getColor(theme, pull),
    },
    '.MuiTabs-indicator': {
        backgroundColor: getColor(theme, pull),
    },
}));

const StyledTab = styled(Tab)(({ theme, pull }) => ({
    '& > span:first-of-type': {
        color: getColor(theme, pull),
    },
}));

const StyledTabLabel = styled('span')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

function TabLabel(
    {
        pull,
        pullRequestUrl,
    }: TabLabelProps
): JSX.Element {

    const getIcon = (): JSX.Element | null => {
        if (pullRequestUrl && pull) {
            let state: 'Open' | 'Closed' | 'Merged' | undefined;
            let icon: JSX.Element | undefined;
            const fontSize: iconFontSize = 'inherit';
            const iconProps = {
                fontSize: fontSize,
                sx: { ml: '0.25rem' },
            };
            if (pull.state === 'open') {
                icon = <ScheduleIcon {...iconProps} />;
                state = 'Open';
            }
            if (pull.closedAt) {
                icon = <ReportOutlinedIcon {...iconProps} />;
                state = 'Closed';
            }
            if (pull.mergedAt) {
                icon = <MergeIcon {...iconProps} />;
                state = 'Merged';
            }
            if (state == undefined) {
                throw new Error('expected state to be defined');
            }
            if (icon === undefined) {
                throw new Error('expected icon to be defined');
            }
            return (
                <Tooltip
                    title={`${state}: ${pullRequestUrl}`}
                    placement='top'
                >
                    {icon}
                </Tooltip>
            );
        }
        return null;
    };

    return (
        <StyledTabLabel>
            default{getIcon()}
        </StyledTabLabel>
    );
};

function TabContent(
    {
        index,
        activeIndex,
    }: TabContentProps
): JSX.Element | null {
    return (
        index === activeIndex
            ? <EditorTab />
            : null
    );
}

function getColor(theme, pull: PullType | undefined) {
    if (pull && pull.state === 'closed') {
        return 'red';
    }
    return theme.palette.primary;
}

// TODO: Fix inconsistent padding or margin in edit mode.
export default function Editor(): JSX.Element {
    const theme = useTheme();
    const { tabs } = useEditor();
    const [activeIndex, setActiveIndex] = React.useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveIndex(newValue);
    };

    return (
        <EditorContainer>
            {/* TODO(dguyen0304): Add bottom box-shadow style. */}
            <Box sx={{
                width: '100%',
                borderBottom: 1,
                borderColor: 'divider',
            }}>
                {/* TODO(dnguyen0304): Set textColor and indicatorColor based on
                    the pull request status. */}
                <StyledTabs
                    onChange={handleChange}
                    value={activeIndex}
                    pull={tabs[activeIndex].pull}
                >
                    {tabs.map((tab, index) =>
                        <StyledTab
                            key={`tab-${index}`}
                            pull={tab.pull}
                            label={
                                <TabLabel
                                    pull={tab.pull}
                                    pullRequestUrl={tab.pullRequestUrl}
                                />
                            }
                        />
                    )}
                </StyledTabs>
            </Box>
            {tabs.map((tab, index) =>
                <TabContent
                    key={`tab-content-${index}`}
                    index={index}
                    activeIndex={activeIndex}
                />
            )}
        </EditorContainer >
    );
}