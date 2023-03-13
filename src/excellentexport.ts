/**
 * ExcellentExport 3.7.2
 * A client side Javascript export to Excel.
 *
 * @author: Jordi Burgos (jordiburgos@gmail.com)
 * @url: https://github.com/jmaister/excellentexport
 *
 */

import * as utils from "./utils";

// Fix for IE11: https://stackoverflow.com/questions/69485778/new-typescript-version-does-not-include-window-navigator-mssaveblob
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

/*
  export type ExcellentExportType = {
    version: () => string,
    convert: (options:ConvertOptions, sheets:SheetOptions[]) => void,
    tableToArray: (table:HTMLTableElement) => any[][],
  }
*/

const ExcellentExport = (function () {
  const version = "4.0.0";

  /*
    ExcellentExport.convert(options, sheet);

    Options:
    {
      anchor: String or HTML Element,
      openAsDownload: boolean, // Use this options if not using an anchor tag
      filename: String,
    }

    Sheets must be an array of sheet configuration objects. Sheet description:
    {
      from: {
        table: String/Element, // Table ID or table element
        array: [...], // Array with the data. Array where each element is a row. Every row is an array of the cells.
      },
      removeColumns: [...], // Array of column indexes (from 0)
      filterRowFn: function(row) {return true}, // Function to decide which rows are returned
      fixValue: function(value, row, column) {return fixedValue}, // Function to fix values, receiving value, row num, column num
      fixArray: function(array) {return array}, // Function to manipulate the whole data array
      delimiter: ",", // String to separate columns
      newLine: "\r\n", // String to separate rows
    }
  */
  const convert = function (options: ConvertOptions, sheet: SheetOptions) {
    let csvDelimiter = ",";
    let csvNewLine = "\r\n";

    if (sheet.delimiter !== undefined && sheet.delimiter) {
      csvDelimiter = sheet.delimiter;
    }
    if (sheet.newLine !== undefined && sheet.newLine) {
      csvNewLine = sheet.newLine;
    }

    // Select data source
    let dataArray: any[][];
    if (sheet.from && sheet.from.table) {
      dataArray = utils.tableToArray(utils.getTable(sheet.from.table));
    } else if (sheet.from && sheet.from.array) {
      dataArray = sheet.from.array;
    } else {
      throw new Error("No data for sheet: [" + name + "]");
    }

    // Filter rows
    if (sheet.filterRowFn) {
      if (sheet.filterRowFn instanceof Function) {
        dataArray = dataArray.filter(sheet.filterRowFn);
      } else {
        throw new Error('Parameter "filterRowFn" must be a function.');
      }
    }
    // Filter columns
    if (sheet.removeColumns) {
      utils.removeColumns(dataArray, sheet.removeColumns);
    }

    // Convert data. Function applied to each value independently, receiving (value, rownum, colnum)
    if (sheet.fixValue && typeof sheet.fixValue === "function") {
      const fn = sheet.fixValue;
      dataArray.map((r, rownum) => {
        r.map((value, colnum) => {
          dataArray[rownum][colnum] = fn(value, rownum, colnum);
        });
      });
    }

    // Convert data, whole array
    if (sheet.fixArray && typeof sheet.fixArray === "function") {
      const fn = sheet.fixArray;
      dataArray = fn(dataArray);
    }

    const csvData =
      "\uFEFF" + utils.arrayToCSV(dataArray, csvDelimiter, csvNewLine);
    const b64 = utils.base64(csvData);
    try {
      const filename = (options.filename || "download") + ".csv";
      if (options.anchor) {
        const anchor = utils.getAnchor(options.anchor);
        return utils.createDownloadLink(
          anchor,
          b64,
          "application/csv",
          filename
        );
      } else if (options.openAsDownload) {
        const a = document.createElement("a");
        if (utils.createDownloadLink(a, b64, "application/csv", filename)) {
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        throw new Error(
          "Options should specify an anchor or openAsDownload=true."
        );
      }
    } catch (e) {
      throw new Error("Error converting to CSV. " + e);
    }
    return csvData;
  };

  return {
    version: function (): string {
      return version;
    },
    convert: function (options: ConvertOptions, sheet: SheetOptions) {
      return convert(options, sheet);
    },
    tableToArray: utils.tableToArray,
  };
})();

export default ExcellentExport;
