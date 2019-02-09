import { Component, OnInit } from '@angular/core';
import { toolbox_week2 } from './toolbox';

declare var Blockly: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    workspace: any;
    code: string;
    showCode = false;
    isError = false;

    ngOnInit() {
        setTimeout(() => {
            this.workspace = Blockly.inject('blocklyDiv', { toolbox: toolbox_week2 });
            this.workspace.addChangeListener(() => {
                Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
                const code = Blockly.JavaScript.workspaceToCode(this.workspace).replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
                this.code = this.rewriteVars(code);
            });
        }, 2000);
    }

    runProgram() {
        /* tslint:disable */
        eval(`
            (function(){
              ${this.code}
            })();
        `);
    }

    rewriteVars(code: string) {
        let lines = code.split('\n');

        if (!lines || !lines.length || !lines[0].startsWith('var ')) {
            this.isError = this.isErrorInLines(lines);
            return code;
        }

        const variables = this.getVariables(lines[0]);
        const cleanLines = lines.slice(1).filter(line => !!line);
        const rewriteLines = [];

        console.log('variables');
        console.log(variables);
        console.log('cleanLines');
        console.log(cleanLines);

        for (var i = 0; i < cleanLines.length; i++) {
            const line = cleanLines[i];
            rewriteLines.push(line);

            if (line.startsWith('function ')) {
                const paramMap = this.getFunctionParamMap(line);
                const functionRaw = this.getFunctionRaw(cleanLines.slice(i));
                const varsWithoutParams = variables.filter(v => !paramMap[v] && functionRaw.indexOf(v) > 0);

                console.log('paramMap');
                console.log(paramMap);
                console.log('varsWithoutParams');
                console.log(varsWithoutParams);

                if (varsWithoutParams.length) {
                    rewriteLines.push('  var ' + varsWithoutParams.join(', ') + ';');
                }
            }

            if (line === '}') {
                rewriteLines.push('');
            }
        }

        this.isError = this.isErrorInLines(rewriteLines);

        console.log('rewriteLines');
        console.log(rewriteLines);
        return '\n' + rewriteLines.join('\n');
    }

    getVariables(varLine: string) {
        return varLine
            .replace('var ', '')
            .replace(';', '')
            .split(',')
            .map(line => line.trim());
    }

    getFunctionParamMap(functionDef: string) {
        const startIndex = functionDef.indexOf('(') + 1;
        const endIndex = functionDef.indexOf(')');
        const rawParams = functionDef.substring(startIndex, endIndex);
        return rawParams
            .split(',')
            .map(param => param.trim())
            .reduce((map, param) => {
                map[param] = true;
                return map;
            }, {});
    }

    getFunctionRaw(lines: string[]) {
        const functionLines = [];

        for (let i = 0; i < lines.length; i++) {
            functionLines.push(lines[i]);
            if (lines[i] === '}') {
                return functionLines.join('\n');
            }
        }

        return functionLines.join('\n');
    }

    isErrorInLines(lines: string[] = []) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line.startsWith('function ') && !line.startsWith(' ') && line !== '' && !line.endsWith(');') && line !== '}') {
                console.log('issue with --' + line);
                return true;
            } else {
                console.log('line valid:' + lines);
            }
        }

        return false;
    }
}
