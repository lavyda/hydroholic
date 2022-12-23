import OpenProps from 'open-props';

export enum BlockState {
  unknown = 'unknown',
  free = 'free',
  closed = 'closed',
  occupied1 = 'occupied1',
  occupied2 = 'occupied2',
}

export type Block = {
  featureId: number,
  name: string | null,
  start: string,
  end: string,
  state: BlockState,
  position: number,
}

export const BlockStateColor: Record<BlockState, string> = {
  [BlockState.unknown]: 'transparent',
  [BlockState.free]: OpenProps.blue6,
  [BlockState.closed]: OpenProps.gray6,
  [BlockState.occupied1]: OpenProps.red6,
  [BlockState.occupied2]: OpenProps.purple6,
}