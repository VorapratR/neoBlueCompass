export interface Location {
    name: string;
    building: string;
    floor: number;
    id: number;
}
export interface LocationQuery {
    results: Location[];
    lastPage: boolean;
}
