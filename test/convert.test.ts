const assert = require("assert");

import ExcellentExport, {
  ConvertOptions,
  SheetOptions,
} from "../src/excellentexport";

describe("convert() API", function () {
  describe("convert from array", function () {
    beforeEach(() => {
      window.URL.createObjectURL = () => "blob:fake_URL";

      document.body.innerHTML = "";
      const element = document.createElement("div");
      element.innerHTML = '<a id="anchor">Link</a>';

      document.body.appendChild(element);
    });

    it("should create a CSV from array", function () {
      const options = {
        anchor: "anchor",
        filename: "data_from_array",
      } as ConvertOptions;

      const sheet = {
        from: {
          array: [
            [1, 2, 3],
            ["hello", "2200", "bye"],
            ['quo"te', 'dobl"e qu"ote', "singl'e quote"],
            [6666, 7777, 8888],
            ["lorem", "ipsum", "dolor"],
          ],
        },
      } as SheetOptions;

      const workbook = ExcellentExport.convert(options, sheet);

      assert.ok(workbook, "Result must not be null");

      const anchor = document.getElementById("anchor") as HTMLAnchorElement;
      assert.ok(anchor.href, "Element must have href");
      assert.ok(
        anchor.href.indexOf("blob:") === 0,
        "Element href myst be a blob:"
      );
    });
  });
});
