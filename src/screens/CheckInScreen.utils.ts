import { ROUTES } from '../navigation/routes';
import { ActivationSource } from '../services/ActivationService';

export type RecommendationAction = {
  route: string;
  source: ActivationSource;
  cta: string;
};

export const getRecommendationAction = (
  mood: number,
  energy: number,
): RecommendationAction => {
  if (mood >= 4 && energy >= 4) {
    return {
      route: ROUTES.FOCUS,
      source: 'checkin_prompt',
      cta: 'START IGNITE',
    };
  }

  if (mood <= 2 && energy <= 2) {
    return {
      route: ROUTES.ANCHOR,
      source: 'checkin_prompt',
      cta: 'OPEN ANCHOR',
    };
  }

  if (energy <= 2) {
    return {
      route: ROUTES.FOG_CUTTER,
      source: 'checkin_prompt',
      cta: 'OPEN FOG CUTTER',
    };
  }

  return {
    route: ROUTES.BRAIN_DUMP,
    source: 'checkin_prompt',
    cta: 'OPEN BRAIN DUMP',
  };
};
