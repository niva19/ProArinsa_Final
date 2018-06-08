import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ChildProcessService } from 'ngx-childprocess';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  constructor(private _electronService: ElectronService, private _childProcessService: ChildProcessService) { }

  Exec_Command_Sync(str) {
    this._childProcessService.childProcess.execSync(str, [])
  }
}
