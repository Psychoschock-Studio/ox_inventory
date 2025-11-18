import React from 'react';
import { fetchNui } from '../../utils/fetchNui';
import {
  Shirt,
  Ear,
  Watch,
  Glasses,
  Backpack,
} from 'lucide-react';
import {
  GiGloves,
  GiTrousers,
  GiRunningShoe,
} from 'react-icons/gi';

interface ActionButton {
  id: number;
  icon: React.ReactNode;
  tooltip: string;
}

const ActionButtons: React.FC = () => {
  const handleButtonClick = (id: number) => {
    fetchNui('actionButton', { id });
  };

  // SVG pour chapeau (hat)
  const HatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M269.4 6.4C280.5-2.1 295.5-2.1 306.6 6.4l224 168c11.4 8.5 15.9 23.3 11.2 36.9s-17.4 22.7-31.8 22.7H448v96c0 17.7-14.3 32-32 32H384V288c0-17.7-14.3-32-32-32H160c-17.7 0-32 14.3-32 32v96H96c-17.7 0-32-14.3-32-32V234H32c-14.4 0-27.1-9.1-31.8-22.7s-.2-28.4 11.2-36.9l224-168zM160 288H352V512H160V288z" />
    </svg>
  );

  // SVG pour masque (mask)
  const MaskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
      <path d="M288 64C64 64 0 160 0 272S80 448 176 448h8.4c24.2 0 46.4-13.7 57.2-35.4l23.2-46.3c4.4-8.8 13.3-14.3 23.2-14.3s18.8 5.5 23.2 14.3l23.2 46.3c10.8 21.7 33 35.4 57.2 35.4H400c96 0 176-64 176-176s-64-208-288-208zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm320-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
    </svg>
  );

  // SVG pour écharpe (scarf)
  const ScarfIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M502.6 54.6l-40-40c-12.5-12.5-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3l40 40c12.5 12.5 32.8 12.5 45.3 0l320-320c12.5-12.5 12.5-32.8 0-45.3zM195.1 361.4c-1.8 4.6-4.1 9.1-6.9 13.4c-5.8 8.7-13.3 16.3-22 22.7l-50.7 37.4c-3.7 2.7-8.2 4.1-12.8 4.1c-6.2 0-12.3-2.7-16.4-7.8L9.4 334.6c-6.9-8.3-5.8-20.7 2.5-27.6l37.4-31.1c6.4-5.3 14-9.3 22.2-11.7c4.3-1.3 8.7-2 13.1-2.3l50.7-3.4c9.3-.6 18.6 2 26.3 7.6l37.4 27.4c7.7 5.6 13 13.9 15.1 23.3l7.6 33.9c1.2 5.4 .7 11-1.5 16.2zM361.4 195.1c-4.6 1.8-9.1 4.1-13.4 6.9c-8.7 5.8-16.3 13.3-22.7 22l-37.4 50.7c-2.7 3.7-4.1 8.2-4.1 12.8c0 6.2 2.7 12.3 7.8 16.4l97.6 76.9c8.3 6.9 20.7 5.8 27.6-2.5l31.1-37.4c5.3-6.4 9.3-14 11.7-22.2c1.3-4.3 2-8.7 2.3-13.1l3.4-50.7c.6-9.3-2-18.6-7.6-26.3l-27.4-37.4c-5.6-7.7-13.9-13-23.3-15.1l-33.9-7.6c-5.4-1.2-11-.7-16.2 1.5z" />
    </svg>
  );

  // SVG pour veste (jacket)
  const JacketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
      <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z" />
    </svg>
  );

  // Wrapper components for react-icons to fix TypeScript issues
  const GlovesIcon = (): React.ReactElement => React.createElement(GiGloves as any);
  const TrousersIcon = (): React.ReactElement => React.createElement(GiTrousers as any);
  const RunningShoeIcon = (): React.ReactElement => React.createElement(GiRunningShoe as any);

  const buttons: ActionButton[] = [
    {
      id: 1,
      icon: <HatIcon />,
      tooltip: 'Chapeau',
    },
    {
      id: 2,
      icon: <Shirt />,
      tooltip: 'Chandail',
    },
    {
      id: 3,
      icon: <MaskIcon />,
      tooltip: 'Masque',
    },
    {
      id: 4,
      icon: <Ear />,
      tooltip: 'Oreille',
    },
    {
      id: 5,
      icon: <Watch />,
      tooltip: 'Montre',
    },
    {
      id: 6,
      icon: <Glasses />,
      tooltip: 'Lunette',
    },
    {
      id: 7,
      icon: <ScarfIcon />,
      tooltip: 'Écharpe',
    },
    {
      id: 8,
      icon: <GlovesIcon />,
      tooltip: 'Gants',
    },
    {
      id: 9,
      icon: <JacketIcon />,
      tooltip: 'Veste',
    },
    {
      id: 10,
      icon: <TrousersIcon />,
      tooltip: 'Pantalon',
    },
    {
      id: 11,
      icon: <RunningShoeIcon />,
      tooltip: 'Soulier',
    },
    {
      id: 12,
      icon: <Backpack />,
      tooltip: 'Sac',
    },
  ];

  return (
    <div className="action-buttons-container">
      {buttons.map((button) => (
        <button
          key={button.id}
          className="action-button"
          onClick={() => handleButtonClick(button.id)}
          title={button.tooltip}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
