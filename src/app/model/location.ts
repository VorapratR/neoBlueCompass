export interface Location {
    name?: string;
    // building: string;
    neighbor: object;
    x: number;
    y: number;
    floor: number;
    id: string;
}
export interface LocationQuery {
    results: Location[];
    // lastPage: boolean;
}
