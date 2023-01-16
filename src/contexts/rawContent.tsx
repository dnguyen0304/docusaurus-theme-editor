import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Import from docusaurus-plugin-editor.
interface RawContent {
    readonly [key: string]: string;
};

interface ContextValue {
    readonly rawContent: RawContent;
    readonly setRawContent: React.Dispatch<React.SetStateAction<RawContent>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (content: RawContent): ContextValue => {
    const [rawContent, setRawContent] = React.useState<RawContent>(content);

    return React.useMemo(
        () => ({ rawContent, setRawContent }),
        [rawContent, setRawContent],
    );
};

interface Props {
    readonly rawContent: RawContent;
    readonly children: React.ReactNode;
};

export const RawContentProvider = (
    {
        rawContent,
        children,
    }: Props
): JSX.Element => {
    const value = useContextValue(rawContent);

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const useRawContent = (): ContextValue => {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('RawContentProvider');
    }
    return context;
};
