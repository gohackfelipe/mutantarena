document.querySelector('mutation-test-report-app').report = {
  "files": {
    "/Users/feliperibeiro/Documents/Projects/mutantarena/mutation-service/src/app.js": {
      "language": "javascript",
      "mutants": [{
        "id": "0",
        "location": {
          "end": {
            "column": 4,
            "line": 6
          },
          "start": {
            "column": 21,
            "line": 2
          }
        },
        "mutatorName": "Block",
        "replacement": "{}",
        "status": "Killed"
      }, {
        "id": "1",
        "location": {
          "end": {
            "column": 4,
            "line": 10
          },
          "start": {
            "column": 9,
            "line": 8
          }
        },
        "mutatorName": "Block",
        "replacement": "{}",
        "status": "Killed"
      }, {
        "id": "2",
        "location": {
          "end": {
            "column": 27,
            "line": 9
          },
          "start": {
            "column": 12,
            "line": 9
          }
        },
        "mutatorName": "BinaryExpression",
        "replacement": "this.x - this.y",
        "status": "Killed"
      }],
      "source": "class Calculator {\n  constructor(x, y) {\n    this.total = 0;\n    this.x = x;\n    this.y = y;\n  }\n\n  sum() {\n    return this.x + this.y;\n  }\n}\n\nmodule.exports = Calculator;"
    }
  },
  "schemaVersion": "1.0",
  "thresholds": {
    "break": null,
    "high": 80,
    "low": 60
  }
};
