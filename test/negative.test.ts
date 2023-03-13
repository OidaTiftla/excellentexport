const assert = require("assert");

import ExcellentExport, {
  ConvertOptions,
  SheetOptions,
} from "../src/excellentexport";

describe("convert() API", function () {
  describe("Negative tests", function () {
    beforeEach(() => {
      window.URL.createObjectURL = () => "blob:fake_URL";

      const element = document.createElement("div");
      element.innerHTML = '<a id="anchor">Link</a>';

      document.body.appendChild(element);
    });

    it("should fail if CSV has more than one sheet", function () {
      const options = {
        anchor: "anchor",
        filename: "data_from_array",
      } as ConvertOptions;

      const sheet = {
        from: {},
      };

      assert.throws(() => {
        ExcellentExport.convert(options, sheet);
      }, Error);
    });

    it("should fail if sheet does not have data", function () {
      const options = {
        anchor: "anchor",
        filename: "data_from_array",
      } as ConvertOptions;

      const sheet = {
        // from: {}
      } as SheetOptions;

      assert.throws(() => {
        ExcellentExport.convert(options, sheet);
      }, Error);
    });

    it("should fail if anchor is not defined/valid", function () {
      const options = {
        anchor: "anchor1235d5d5d5d_invalid",
        filename: "data_from_array",
      } as ConvertOptions;

      const sheet = {
        from: {},
      };

      assert.throws(() => {
        ExcellentExport.convert(options, sheet);
      }, Error);
    });

    it("should fail if no anchor and not openAsDownload", function () {
      const options = {
        filename: "data_from_array",
      } as ConvertOptions;

      const sheet = {
        from: {},
      };

      assert.throws(() => {
        ExcellentExport.convert(options, sheet);
      }, Error);
    });
  });
});
