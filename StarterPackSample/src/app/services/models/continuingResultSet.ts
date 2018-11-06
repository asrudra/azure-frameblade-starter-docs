export interface ContinuingResultSet<T> {
    items: T[];
    continuationToken: string;
}