import { error, json } from '@sveltejs/kit';
import { getBlocks } from '../../../../cityPoolKosice/cityPoolKosice';
import { features } from '../../../../common/services/features';
import type { RequestHandler } from './$types';

export const GET = (async ({ params, url }) => {
  const featureId = Number(params.feature);
  const date = url.searchParams.get('date') ?? undefined;

  const feature = features.find((f) => f.id === featureId);
  if (!feature) {
    throw error(404);
  }

  try {
    const blocks = await getBlocks(featureId, date);
    const response = { ...feature, blocks };
    return json(response);
  } catch {
    throw error(500);
  }
}) satisfies RequestHandler;