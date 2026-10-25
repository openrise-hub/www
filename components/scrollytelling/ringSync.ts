export interface RingSyncData {
  cx: number;
  cy: number;
  rOuter: number;
  rMiddle: number;
  rInner: number;
}

type SyncCallback = (data: RingSyncData) => void;
const subscribers = new Set<SyncCallback>();

let lastData: RingSyncData = {
  cx: typeof window !== 'undefined' ? window.innerWidth / 2 : 720,
  cy: typeof window !== 'undefined' ? window.innerHeight / 2 : 380,
  rOuter: 500,
  rMiddle: 380,
  rInner: 240,
};

export function subscribeRingSync(fn: SyncCallback): () => void {
  subscribers.add(fn);
  fn(lastData);
  return () => {
    subscribers.delete(fn);
  };
}

export function emitRingSync(data: RingSyncData): void {
  lastData = data;
  subscribers.forEach((fn) => fn(data));
}
