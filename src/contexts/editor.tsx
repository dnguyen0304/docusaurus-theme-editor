import * as React from 'react';
import {
    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
    LOCAL_STORAGE_KEY_PULL_TITLE,
    LOCAL_STORAGE_KEY_PULL_URL
} from '../constants';
import { GithubPullState } from '../docusaurus-theme-editor';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Refactor to useReducer, which supports functional updates.
// TODO(dnguyen0304): Investigate visibility: hidden to persist state.
// TODO(dnguyen0304): Add markdown and setMarkdown.
// TODO(dnguyen0304): Add lastUpdatedAt.
interface EditorTab {
    tabId: number;
    pull?: GithubPullState;
    pullTitle: string;
    pullUrl: string;
    pullBranchName: string;
    setPull: (newValue: GithubPullState) => void;
    setPullTitle: (
        newValue: string,
        includeLocalStorage: boolean,
    ) => void;
    setPullUrl: (
        newValue: string,
        includeLocalStorage: boolean,
    ) => void;
    setPullBranchName: (
        newValue: string,
        includeLocalStorage: boolean,
    ) => void;
}

interface AddTabProps {
    pullTitle: string;
    pullUrl: string;
    pullBranchName: string;
}

// aliases: table of contents
interface ContextValue {
    readonly editorIsOpen: boolean;
    readonly activeTabId: number;
    readonly tabs: EditorTab[];
    readonly addTab: (props: AddTabProps) => EditorTab;
    readonly setEditorIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setActiveTabId: React.Dispatch<React.SetStateAction<number>>
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [editorIsOpen, setEditorIsOpen] = React.useState<boolean>(false);
    const [activeTabId, setActiveTabId] = React.useState<number>(0);
    const [tabs, setTabs] = React.useState<EditorTab[]>([]);
    const [tabIdCounter, setTabIdCounter] = React.useState<number>(0);

    const getNextTabId = (): number => {
        const nextTabId = tabIdCounter;
        setTabIdCounter(nextTabId + 1);
        return nextTabId;
    };

    const addTab = (
        {
            pullTitle = '',
            pullUrl = '',
            pullBranchName = '',
        }: AddTabProps
    ): EditorTab => {
        const tabId = getNextTabId();
        // TODO(dnguyen0304): Refactor duplicated code.
        const setPull = (newValue: GithubPullState) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pull: newValue,
                }
            }));
        };
        const setPullTitle = (
            newValue: string,
            includeLocalStorage: boolean,
        ) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullTitle: newValue,
                }
            }));
            if (includeLocalStorage) {
                localStorage.setItem(
                    LOCAL_STORAGE_KEY_PULL_TITLE,
                    newValue,
                );
            }
        };
        const setPullUrl = (
            newValue: string,
            includeLocalStorage: boolean,
        ) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullUrl: newValue,
                }
            }));
            if (includeLocalStorage) {
                localStorage.setItem(
                    LOCAL_STORAGE_KEY_PULL_URL,
                    newValue,
                );
            }
        };
        const setPullBranchName = (
            newValue: string,
            includeLocalStorage: boolean,
        ) => {
            setTabs(tabs => tabs.map(tab => {
                if (tab.tabId !== tabId) {
                    return tab;
                }
                return {
                    ...tab,
                    pullBranchName: newValue,
                }
            }));
            if (includeLocalStorage) {
                localStorage.setItem(
                    LOCAL_STORAGE_KEY_PULL_BRANCH_NAME,
                    newValue,
                );
            }
        };
        const newTab = {
            tabId,
            setPull,
            pullTitle,
            setPullTitle,
            pullUrl,
            setPullUrl,
            pullBranchName,
            setPullBranchName,
        };

        setTabs(prev => [
            ...prev,
            newTab,
        ]);

        return newTab;
    };

    return React.useMemo(
        () => ({
            editorIsOpen,
            activeTabId,
            tabs,
            addTab,
            setEditorIsOpen,
            setActiveTabId,
        }),
        [
            editorIsOpen,
            activeTabId,
            tabs,
            addTab,
            setEditorIsOpen,
            setActiveTabId,
        ],
    );
}

interface Props {
    readonly children: React.ReactNode;
};

function EditorProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

function useEditor(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('EditorProvider');
    }
    return context;
}

export {
    EditorProvider,
    EditorTab,
    useEditor,
};
