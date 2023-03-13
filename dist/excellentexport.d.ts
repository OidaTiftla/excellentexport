/**
 * ExcellentExport 3.7.2
 * A client side Javascript export to Excel.
 *
 * @author: Jordi Burgos (jordiburgos@gmail.com)
 * @url: https://github.com/jmaister/excellentexport
 *
 */
declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean;
    }
}
export interface ConvertOptions {
    anchor?: string | HTMLAnchorElement;
    openAsDownload?: boolean;
    filename?: string;
}
export interface FromOptions {
    table?: string | HTMLTableElement;
    array?: any[][];
}
export interface SheetOptions {
    from: FromOptions;
    removeColumns?: number[];
    filterRowFn?(row: any[]): boolean;
    fixValue?(value: any, row: number, column: number): any;
    fixArray?(array: any[][]): any[][];
    delimiter?: string;
    newLine?: string;
}
declare const ExcellentExport: {
    version: () => string;
    convert: (options: ConvertOptions, sheet: SheetOptions) => string | boolean;
    tableToArray: (table: HTMLTableElement) => any[][];
};
export default ExcellentExport;
