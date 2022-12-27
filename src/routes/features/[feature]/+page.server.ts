import { error } from '@sveltejs/kit';
import { features } from '../../../common/services/features';
import { getBlocks } from '../../../cityPoolKosice/cityPoolKosice';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, url }) => {
  const featureId = Number(params.feature);
  const feature = features.find((f) => f.id === featureId);
  const date = url.searchParams.get('date') ?? undefined;
  if (!feature) {
    throw error(404);
  }

  try {
    const blocks = await getBlocks(featureId, date);
    return { ...feature, blocks };
  } catch {
    throw error(500);
  }
}) satisfies PageServerLoad;