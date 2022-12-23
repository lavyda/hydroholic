import { error } from '@sveltejs/kit';
import { getBlocks } from '../../../cityPoolKosice/cityPoolKosice';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  try {
    const blocks = await getBlocks(Number(params.feature));
    return { blocks };
  } catch {
    throw error(500, 'Error');
  }
}) satisfies PageServerLoad;