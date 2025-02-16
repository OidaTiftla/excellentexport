const assert = require("assert");

import ExcellentExport, { ConvertOptions } from "../src/excellentexport";

describe("Fix data", function () {
  beforeEach(() => {
    window.URL.createObjectURL = () => "blob:fake_URL";

    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.innerHTML = '<a id="anchor">Link</a>';

    document.body.appendChild(element);
  });

  it("should fix values", function () {
    const options = {
      anchor: "anchor",
      filename: "data_from_array",
    } as ConvertOptions;

    const sheet = {
      from: {
        array: [["hello", "<td>hello</td>", "bye"]],
      },
      fixValue: (value, row, col) => {
        let v = value.replace(/<br>/gi, "\n");
        let strippedString = v.replace(/(<([^>]+)>)/gi, "");
        return strippedString;
      },
    };

    const workbook = ExcellentExport.convert(options, sheet);
    assert.ok(workbook, "Result must not be null");
  });

  it("should process the whole array", function () {
    const options = {
      anchor: "anchor",
      filename: "data_from_array",
    } as ConvertOptions;

    const sheet = {
      from: {
        array: [["hello", "<td>hello</td>", "bye"]],
      },
      fixData: (array) => {
        return array.map((r) => {
          return r.map((v) => {
            return "fixed-" + v;
          });
        });
      },
    };

    const workbook = ExcellentExport.convert(options, sheet);
    assert.ok(workbook, "Result must not be null");
  });
});
