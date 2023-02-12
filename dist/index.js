"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flutterAnalyze = void 0;
const fs = __importStar(require("fs"));
async function flutterAnalyze() {
    const report_txt = fs.readFileSync('./flutter_analyze_report.txt', 'utf-8').split('\n').map(line_txt => line_txt.trim());
    const reports = report_txt.filter(line => checkSeverity(line)).map(report => {
        const splittedRport = report.split(" • ");
        return new AnalyzeResult(Severity.INFO, splittedRport[1], splittedRport[2].split(":")[0], splittedRport[2].split(":")[1]);
    });
    reports.forEach(value => {
        switch (value.severity) {
            case Severity.INFO:
                message(value.description, value.fileName, value.line);
                break;
            case Severity.ERROR:
            case Severity.WARNING:
                warn(value.description, value.fileName, value.line);
        }
    });
}
exports.flutterAnalyze = flutterAnalyze;
function checkSeverity(value) {
    for (let key in Severity) {
        if (value.startsWith(Severity[key])) {
            return true;
        }
    }
    return false;
}
var Severity;
(function (Severity) {
    Severity["INFO"] = "info";
    Severity["WARNING"] = "warning";
    Severity["IGNORE"] = "ignor";
    Severity["ERROR"] = "error";
})(Severity || (Severity = {}));
class AnalyzeResult {
    severity;
    description;
    fileName;
    line;
    constructor(severity, description, fileName, line) {
        this.severity = severity;
        this.description = description;
        this.fileName = fileName;
        this.line = line;
    }
}
