export interface KeyClockStorage {
  abstract get(key: string): Promise<any>;
  abstract add(state: any);
}
