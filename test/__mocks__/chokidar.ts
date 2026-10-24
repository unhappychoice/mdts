import { EventEmitter } from 'events';

export class FSWatcher extends EventEmitter {
  add(): this { return this; }
  on(): this { return this; }
  close(): void { }
}

export const watch = jest.fn(() => new FSWatcher());
