import { addMinutes, eachMinuteOfInterval, formatISO, set } from 'date-fns';
import { JSDOM } from 'jsdom';
import { parseTable } from "html-table-parser";
import { BlockState, type Block } from "../common/services/blocks";

const BlockStateMap: Record<string, BlockState> = {
  DayView_0_0: BlockState.unknown,
  DayView_0_1: BlockState.occupied1,
  DayView_0_2: BlockState.occupied2,
  DayView_0_3: BlockState.closed,
  DayView_1_1: BlockState.free,
  DayView_1_2: BlockState.free,
}

const host = 'http://88.212.33.102';

async function getPool(searchParams: Record<string, string>): Promise<string> {
  const params = new URLSearchParams(searchParams);
  const url = `${host}/PoolSolution/DayToSetView.aspx?${params}`;
  return fetch(url).then(r => r.text());
}

function parsePool(featureId: number, html: string): Block[] {
  const starts = eachMinuteOfInterval({
    start: set(new Date, { hours: 6, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(new Date, { hours: 22, minutes: 0, seconds: 0, milliseconds: 0 })
  }, { step: 30 });

  const document = new JSDOM(html).window.document as Document;
  const table = document.querySelector('table.DayView') as HTMLTableElement;
  if (!table) {
    return [];
  }
  const ignoredRowsOffset = 2;
  const ignoredColumnsOffset = 2;
  const rows = parseTable(table);
  const processedCells: number[] = [];
  const blocks = [];
  for (const row of rows.slice(ignoredRowsOffset)) {
    for (const cell of row.slice(ignoredColumnsOffset)) {
      if (processedCells.includes(cell.elementId)) {
        continue;
      }
      const name = cell.textContent?.trim().replace('\n', '') ?? null;
      const originalState = cell.attributes?.class;
      const state = originalState ? BlockStateMap[originalState] : BlockState.unknown;
      const startIndex = cell.left - ignoredColumnsOffset;
      const start = formatISO(starts[startIndex]);
      const end = formatISO(addMinutes(starts[startIndex], 30 * Number(cell.attributes?.colspan) ?? 1));
      const occupiedLanes = cell.attributes?.rowspan ?? 1;
      for (let offset = 1; offset <= occupiedLanes; offset++) {
        const position = cell.top - ignoredRowsOffset + offset;
        blocks.push({ position, start, end, name, state, featureId });
      }
      processedCells.push(cell.elementId);
    }
  }
  return blocks;
};

export async function getBlocks(id: number, date?: string) {
  try {
    const response = await getPool({ PoolID: id.toString() });
    return parsePool(id, response);
  } catch (e) {
    console.error(e);
    throw e;
  }
}