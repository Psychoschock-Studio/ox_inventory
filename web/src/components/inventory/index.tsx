import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import ActionButtons from './ActionButtons';
import CommandsPanel from './CommandsPanel';
import DiscordPanel from './DiscordPanel';
import JobsPanel from './JobsPanel';
import WeeklyQuestsPanel from './WeeklyQuestsPanel';
import { fetchNui } from '../../utils/fetchNui';
import { Package, Terminal, MessageCircle, Briefcase, Scroll } from 'lucide-react';

type ActiveTab = 'inventory' | 'commands' | 'discord' | 'jobs' | 'quests';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    setActiveTab('inventory');
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="inventory-wrapper">
          <div className="inventory-container">
            {(activeTab === 'inventory') && <ActionButtons />}
            <div className="inventory-content">
              <button className="inventory-close-button" onClick={() => fetchNui('exit')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
              {activeTab === 'inventory' ? (
                <>
                  <LeftInventory />
                  <InventoryControl />
                  <RightInventory />
                </>
              ) : activeTab === 'commands' ? (
                <CommandsPanel />
              ) : activeTab === 'discord' ? (
                <DiscordPanel />
              ) : activeTab === 'jobs' ? (
                <JobsPanel />
              ) : (
                <WeeklyQuestsPanel />
              )}
            </div>
            <div className="inventory-tabs">
              <button
                className={`inventory-tab ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
                title="Inventaire"
              >
                <Package size={16} />
              </button>
              <button
                className={`inventory-tab ${activeTab === 'commands' ? 'active' : ''}`}
                onClick={() => setActiveTab('commands')}
                title="Commandes"
              >
                <Terminal size={16} />
              </button>
              <button
                className={`inventory-tab ${activeTab === 'discord' ? 'active' : ''}`}
                onClick={() => setActiveTab('discord')}
                title="Discord"
              >
                <MessageCircle size={16} />
              </button>
              <button
                className={`inventory-tab ${activeTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobs')}
                title="Jobs"
              >
                <Briefcase size={16} />
              </button>
              <button
                className={`inventory-tab ${activeTab === 'quests' ? 'active' : ''}`}
                onClick={() => setActiveTab('quests')}
                title="Quêtes Hebdomadaires"
              >
                <Scroll size={16} />
              </button>
            </div>
          </div>
          <Tooltip />
          <InventoryContext />
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
