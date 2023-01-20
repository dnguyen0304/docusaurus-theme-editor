import * as React from 'react';
import { ReactContextError } from './errors';

// This is a subset ("pick") of DocMetadataBase.
// See: https://github.com/facebook/docusaurus/blob/a308fb7c81832cca354192fe2984f52749441249/packages/docusaurus-plugin-content-docs/src/plugin-content-docs.d.ts#L400
interface ContextValue {
    readonly source: string;
    readonly editUrl?: string | null;
    readonly setSource: React.Dispatch<React.SetStateAction<string>>;
    readonly setEditUrl: React.Dispatch<React.SetStateAction<
        string | null | undefined
    >>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (): ContextValue => {
    const [source, setSource] = React.useState<string>('');
    const [editUrl, setEditUrl] = React.useState<string | null | undefined>();

    return React.useMemo(
        () => ({
            source,
            editUrl,
            setSource,
            setEditUrl,
        }),
        [
            source,
            editUrl,
            setSource,
            setEditUrl,
        ],
    );
};

interface Props {
    readonly children: React.ReactNode;
};

export const DocMetadataProvider = ({ children }: Props): JSX.Element => {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const useDocMetadata = (): ContextValue => {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('DocMetadataProvider');
    }
    return context;
};
