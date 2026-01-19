import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { 
  Shirt, 
  HardHat, 
  Footprints, 
  UserX, 
  Glasses, 
  Headphones, 
  Clock, 
  Hand, 
  Backpack, 
  Scissors,
  Circle,
  CircleDot,
  ShirtIcon
} from 'lucide-react';

import VestImage from '../../assets/images/clothing/vest.png';
import TopImage from '../../assets/images/clothing/top.png';
import GlovesImage from '../../assets/images/clothing/gloves.png';
import VisorImage from '../../assets/images/clothing/visor.png';
import HatImage from '../../assets/images/clothing/hat.png';
import ShoesImage from '../../assets/images/clothing/shoes.png';
import MaskImage from '../../assets/images/clothing/mask.png';
import HairImage from '../../assets/images/clothing/hair.png';
import BagImage from '../../assets/images/clothing/bag.png';
import GlassesImage from '../../assets/images/clothing/glasses.png';
import EarImage from '../../assets/images/clothing/ear.png';
import NeckImage from '../../assets/images/clothing/neck.png';
import WatchImage from '../../assets/images/clothing/watch.png';
import BraceletImage from '../../assets/images/clothing/bracelet.png';
import PantsImage from '../../assets/images/clothing/pants.png';

interface ActionButton {
  id: string;
  image: string;
  tooltip: string;
  icon: React.ReactNode;
}

const ActionButtons: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleButtonClick = (category: string) => {
    fetchNui('actionButton', { category });
  };

  const handleImageError = (buttonId: string) => {
    setImageErrors((prev) => ({ ...prev, [buttonId]: true }));
  };

  const buttons: ActionButton[] = [
    { id: 'vest', image: VestImage, tooltip: Locale['clothing_vest'] || 'Vest', icon: <Shirt size={20} /> },
    { id: 'top', image: TopImage, tooltip: Locale['clothing_top'] || 'Top', icon: <Shirt size={20} /> },
    { id: 'gloves', image: GlovesImage, tooltip: Locale['clothing_gloves'] || 'Gloves', icon: <Hand size={20} /> },
    { id: 'visor', image: VisorImage, tooltip: Locale['clothing_visor'] || 'Visor', icon: <HardHat size={20} /> },
    { id: 'hat', image: HatImage, tooltip: Locale['clothing_hat'] || 'Hat', icon: <HardHat size={20} /> },
    { id: 'shoes', image: ShoesImage, tooltip: Locale['clothing_shoes'] || 'Shoes', icon: <Footprints size={20} /> },
    { id: 'mask', image: MaskImage, tooltip: Locale['clothing_mask'] || 'Mask', icon: <UserX size={20} /> },
    { id: 'hair', image: HairImage, tooltip: Locale['clothing_hair'] || 'Hair', icon: <Scissors size={20} /> },
    { id: 'bag', image: BagImage, tooltip: Locale['clothing_bag'] || 'Bag', icon: <Backpack size={20} /> },
    { id: 'glasses', image: GlassesImage, tooltip: Locale['clothing_glasses'] || 'Glasses', icon: <Glasses size={20} /> },
    { id: 'ear', image: EarImage, tooltip: Locale['clothing_ear'] || 'Ear', icon: <Headphones size={20} /> },
    { id: 'neck', image: NeckImage, tooltip: Locale['clothing_neck'] || 'Neck', icon: <Circle size={20} /> },
    { id: 'watch', image: WatchImage, tooltip: Locale['clothing_watch'] || 'Watch', icon: <Clock size={20} /> },
    { id: 'bracelet', image: BraceletImage, tooltip: Locale['clothing_bracelet'] || 'Bracelet', icon: <CircleDot size={20} /> },
    { id: 'pants', image: PantsImage, tooltip: Locale['clothing_pants'] || 'Pants', icon: <ShirtIcon size={20} /> },
  ];

  return (
    <div className="action-buttons-container">
      {buttons.map((button) => (
        <button
          key={button.id}
          className="action-button"
          onClick={() => handleButtonClick(button.id)}
          data-tooltip={button.tooltip}
        >
          {imageErrors[button.id] ? (
            button.icon
          ) : (
            <img 
              src={button.image} 
              alt={button.tooltip}
              onError={() => handleImageError(button.id)}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
