export interface PAGASADocument {
    file: string;
    count: number;
    name: string;
    final?: boolean;
}

export type ExpandedPAGASADocument = PAGASADocument & {
    link: string;
};
