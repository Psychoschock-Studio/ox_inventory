import { ItemData } from '../typings/item';

export const Items: {
  [key: string]: ItemData | undefined;
} = {
  water: {
    name: 'water',
    close: false,
    label: 'VODA',
    stack: true,
    usable: true,
    count: 0,
    rarity: 'common',
  },
  burger: {
    name: 'burger',
    close: false,
    label: 'BURGR',
    stack: false,
    usable: false,
    count: 0,
    rarity: 'common',
  },
  weed: {
    name: 'weed',
    close: false,
    label: 'Weed',
    stack: true,
    usable: false,
    count: 0,
    rarity: 'uncommon',
  },
  lockpick: {
    name: 'lockpick',
    close: false,
    label: 'Lockpick',
    stack: true,
    usable: false,
    count: 0,
    rarity: 'rare',
  },
  advancedkit: {
    name: 'advancedkit',
    close: false,
    label: 'Advanced Kit',
    stack: true,
    usable: false,
    count: 0,
    rarity: 'epic',
  },
  backwoods: {
    name: 'backwoods',
    close: false,
    label: 'Backwoods',
    stack: true,
    usable: false,
    count: 0,
    rarity: 'legendary',
  },
};
