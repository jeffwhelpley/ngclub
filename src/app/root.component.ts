import { Component, OnInit } from '@angular/core';
import { toolbox } from './toolbox';

declare var Blockly: any;

@Component({
    selector: 'app-root',
    template: `
        <div id="blocklyDiv"></div>
        <div>{{ code }}</div>
    `
})
export class RootComponent implements OnInit {
    code: string;

    ngOnInit() {
        const workspace = Blockly.inject('blocklyDiv', { toolbox });
        workspace.addChangeListener(() => {
            this.code = Blockly.JavaScript.workspaceToCode(workspace);
        });
    }
}

