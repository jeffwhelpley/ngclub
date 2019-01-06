import { Component, OnInit } from '@angular/core';
import { toolbox } from './toolbox';

declare var Blockly: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  workspace: any;
  code: string;

  ngOnInit() {
    setTimeout(() => {
      this.workspace = Blockly.inject('blocklyDiv', { toolbox: toolbox });
      this.workspace.addChangeListener(() => {
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        this.code = Blockly.JavaScript.workspaceToCode(this.workspace);
      });
    }, 2000);
  }

  runProgram() {
    /* tslint:disable */
    eval(this.code);
  }
}
