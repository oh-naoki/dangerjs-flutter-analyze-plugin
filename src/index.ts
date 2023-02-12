import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
import * as fs from 'fs';

declare let danger: DangerDSLType
declare function fail(message: string, file?: string, line?: number): void
declare function warn(message: string, file?: string, line?: number): void
declare function message(message: string, file?: string, line?: number): void

export async function flutterAnalyze() {
    const report_txt = fs.readFileSync('./flutter_analyze_report.txt', 'utf-8').split('\n').map(line_txt => line_txt.trim());
    const reports = report_txt.filter(line => checkSeverity(line)).map(report => {
        const splittedRport = report.split(" • ");
        return new AnalyzeResult(
            Severity.INFO,
            splittedRport[1] as string,
            splittedRport[2].split(":")[0] as string,
            splittedRport[2].split(":")[1] as unknown as number,
        )
    });
    reports.forEach(value => {
        switch (value.severity) {
            case Severity.INFO:
                message(value.description, value.fileName, value.line);
                break;
            case Severity.ERROR:
            case Severity.WARNING:
                warn(value.description, value.fileName, value.line)
        }
    });
}

function checkSeverity(value: string): boolean {
    for (let key in Severity) {
        if (value.startsWith(Severity[key as keyof typeof Severity])) {
            return true;
        }
    }
    return false;
}

enum Severity {
    INFO = "info",
    WARNING = "warning",
    IGNORE = "ignor",
    ERROR = "error",
}

class AnalyzeResult {
    severity: Severity
    description: string
    fileName: string
    line: number
    constructor(
        severity: Severity,
        description: string,
        fileName: string,
        line: number,
    ) {
        this.severity = severity
        this.description = description
        this.fileName = fileName
        this.line = line
    }
}