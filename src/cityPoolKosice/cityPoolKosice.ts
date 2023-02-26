import { addMinutes, eachMinuteOfInterval, format, formatISO, set } from 'date-fns';
import { JSDOM } from 'jsdom';
import { parseTable } from "html-table-parser";
import { dev } from '$app/environment';
import { BlockState, type Block } from "../common/services/blocks";
import getPoolMock from './getPool.mock';

const BlockStateMap: Record<string, BlockState> = {
  DayView_0_0: BlockState.unknown,
  DayView_0_1: BlockState.occupied1,
  DayView_0_2: BlockState.occupied2,
  DayView_0_3: BlockState.closed,
  DayView_1_1: BlockState.free,
  DayView_1_2: BlockState.free,
}

const host = 'http://88.212.33.102';

type GetPoolSearchParams = {
  PoolID: string,
}

/**
 * Get pool information for given date. No date specified means today.
 * PoolID 1 is 50m pool, PoolID 2 is 25m pool.
 * @param searchParams
 * @param date format yyyy-MM-dd-HH-mm-ss, e.g. 2022-12-22-00-00-00
 * @returns HTML template
 */
async function getPool(searchParams: GetPoolSearchParams, date?: string): Promise<string> {
  const params = new URLSearchParams(searchParams);
  const url = `${host}/PoolSolution/DayToSetView.aspx?${params}`;
  if (date) {
    const body = new URLSearchParams({
      __EVENTTARGET: 'ctl00$MainContent$cldDate',
      ctl00$MainContent$cldDate$dateInput: date,
    });
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }).then(r => r.text());
  }
  return fetch(url).then(r => r.text());
}

function parsePool(featureId: number, html: string): Block[] {
  const starts = eachMinuteOfInterval({
    // start and end is adjusted to GMT+00, originally start is 6 and end is 22
    start: set(new Date, { hours: 5, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(new Date, { hours: 21, minutes: 0, seconds: 0, milliseconds: 0 })
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
      const name = cell.textContent ? normalizePoolName(cell.textContent) : null;
      const originalState = cell.attributes?.class;
      const state = originalState ? originalState.includes('Zatvorené') ? BlockState.closed : BlockStateMap[originalState] : BlockState.unknown;
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

  blocks.sort((a, b) => a.position - b.position || Date.parse(a.start) - Date.parse(b.start));

  const uniqueBlocks = [];
  let current = blocks[0];
  do {
    const next = blocks
      .slice(blocks.indexOf(current) + 1)
      .find((b) => b.position !== current.position || b.name !== current.name) as Block;
    const end = blocks[blocks.indexOf(next) - 1]?.end ?? current.end;
    uniqueBlocks.push({ ...current, end });
    current = next;
  }
  while (current);
  return uniqueBlocks;
};

export async function getBlocks(id: number, date?: string) {
  try {
    const searchParams = { PoolID: id.toString() };
    const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd-00-00-00') : undefined;
    if (dev) {
      console.log('getBlocks', searchParams, formattedDate);
      return parsePool(id, getPoolMock);
    }
    const response = await getPool(searchParams, formattedDate);
    return parsePool(id, response);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * Transforms text:
 * Removes new lines and whitespaces from start and end.
 * Uses only text after first dash.
 * Example: `D2 - ŠG \nTrieda SNP` is transformed to `ŠG Trieda SNP`
 * @param text text to normalize
 * @returns normalized text
 */
function normalizePoolName(text: string): string | null {
  return /- (.*)/.exec(text.trim().replace('\n', ''))?.[1] ?? null;
}