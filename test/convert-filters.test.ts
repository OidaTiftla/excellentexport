import "expect-puppeteer";

import ExcellentExport, {
  ConvertOptions,
  SheetOptions,
} from "../src/excellentexport";

describe("convert() API", function () {
  describe("test sheet options", function () {
    beforeEach(() => {
      window.URL.createObjectURL = () => "blob:fake_URL";

      document.body.innerHTML = "";
      const element = document.createElement("div");
      element.innerHTML =
        '<table id="sometable"><tr><th>first</th><th>second</th></tr><tr><td>1234</td><td>123.56</td></tr></table>' +
        '<a id="anchor">Link</a>';

      document.body.appendChild(element);
    });

    test("filterRowFn", function () {
      const options = {
        anchor: "anchor",
        filename: "data_from_table",
      } as ConvertOptions;

      const sheet = {
        from: {
          table: "sometable",
        },
        filterRowFn: (row) => {
          if (row[0] === "first") {
            return true;
          }
        },
      } as SheetOptions;

      const workbook = ExcellentExport.convert(options, sheet);
      expect(workbook).not.toBeNull();
    });

    test("removeColumns", function () {
      const options = {
        anchor: "anchor",
        filename: "data_from_table",
      } as ConvertOptions;

      const sheet = {
        from: {
          table: "sometable",
        },
        removeColumns: [1],
      } as SheetOptions;

      const workbook = ExcellentExport.convert(options, sheet);
      expect(workbook).not.toBeNull();
    });
  });
});
