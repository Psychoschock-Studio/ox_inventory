import React, { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectCommandCategories, selectCommandsLoading, selectFavorites, setCommands, setLoading, toggleFavorite } from '../../store/commands';
import { Search, ChevronDown, ChevronRight, Terminal, Star, Copy } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';

const devCommands = {
  categories: [
    { title: 'Général', commands: [
      { id: 'report', description: 'Report an issue to the admins', usage: '/report [message]' },
    ]},
    { title: 'Roleplay', commands: [
      { id: 'me', description: 'Perform an text action visible to nearby players', usage: '/me [action]' },
      { id: 'ooc', description: 'Out-of-character message', usage: '/ooc [message]' },
    ]},
    { title: 'Communication', commands: [
      { id: 'dm', description: 'Send a private message to another user', usage: '/dm [id] [message]' },
      { id: 'anon', description: 'Post an anonymous message to the server', usage: '/anon [message]' },
    ]},
    { title: 'Véhicules', commands: [
      { id: 'givekey', description: 'Give a key to another user', usage: '/givekey [id] [vehicle]' },
      { id: 'trunk', description: 'Open the trunk of your vehicle', usage: '/trunk' },
    ]},
  ],
  favorites: ['report']
};

const CommandsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCommandCategories);
  const loading = useAppSelector(selectCommandsLoading);
  const favorites = useAppSelector(selectFavorites);
  const [search, setSearch] = useState('');
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({ [-1]: true });
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched && categories.length === 0) {
      dispatch(setLoading(true));
      if (isEnvBrowser()) {
        dispatch(setCommands(devCommands));
        setFetched(true);
      } else {
        fetchNui<{ categories: any[]; favorites: string[] }>('getCommands').then((data) => {
          dispatch(setCommands(data || { categories: [], favorites: [] }));
          setFetched(true);
        }).catch(() => {
          dispatch(setLoading(false));
          setFetched(true);
        });
      }
    }
  }, [fetched, categories.length, dispatch]);

  const toggleCategory = (index: number) => {
    setOpenCategories(prev => ({
      ...prev,
      [index]: prev[index] !== true
    }));
  };

  const handleToggleFavorite = (cmdId: string) => {
    dispatch(toggleFavorite(cmdId));
    fetchNui('toggleFavoriteCommand', { id: cmdId });
  };

  const handleCopy = (usage: string) => {
    const cmd = usage || '';
    fetchNui('setClipboard', { text: cmd });
  };

  const allCommands = useMemo(() => {
    const cmds: { cmd: any; category: string }[] = [];
    categories.forEach(cat => {
      cat.commands.forEach(cmd => {
        cmds.push({ cmd, category: cat.title });
      });
    });
    return cmds;
  }, [categories]);

  const favoriteCommands = useMemo(() => {
    return allCommands.filter(({ cmd }) => favorites.includes(cmd.id));
  }, [allCommands, favorites]);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.map(category => ({
      ...category,
      commands: category.commands.filter(cmd =>
        cmd.id.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(category => category.commands.length > 0);
  }, [categories, search]);

  const filteredFavorites = useMemo(() => {
    if (!search) return favoriteCommands;
    return favoriteCommands.filter(({ cmd }) =>
      cmd.id.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [favoriteCommands, search]);

  if (loading) {
    return (
      <div className="commands-panel">
        <div className="commands-panel-header">
          <p>Commandes</p>
        </div>
        <div className="commands-loading">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commands-panel">
      <div className="commands-panel-header">
        <p>Commandes</p>
      </div>

      <div className="commands-search-wrapper">
        <Search size={14} className="commands-search-icon" />
        <input
          type="text"
          className="commands-search-input"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="commands-categories-container">
        {filteredFavorites.length > 0 && (
          <div className="commands-category commands-category-favorites">
            <button
              className="commands-category-header"
              onClick={() => toggleCategory(-1)}
            >
              <div className="commands-category-icon favorite">
                <Star size={12} />
              </div>
              <span className="commands-category-title">Favoris</span>
              <span className="commands-category-count">{filteredFavorites.length}</span>
              {openCategories[-1] === true ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {openCategories[-1] === true && (
              <div className="commands-category-content">
                {filteredFavorites.map(({ cmd }, cmdIndex) => (
                  <div key={cmdIndex} className="commands-item favorite">
                    <div className="commands-item-header">
                      <div className="commands-item-id">/{cmd.id}</div>
                      <div className="commands-item-actions">
                        <button className="commands-action-btn" onClick={() => handleCopy(cmd.usage || `/${cmd.id}`)}>
                          <Copy size={12} />
                        </button>
                        <button className="commands-action-btn active" onClick={() => handleToggleFavorite(cmd.id)}>
                          <Star size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="commands-item-description">{cmd.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {filteredCategories.length === 0 && filteredFavorites.length === 0 ? (
          <div className="commands-empty">
            <p>Aucune commande trouvée</p>
          </div>
        ) : (
          filteredCategories.map((category, index) => {
            const isOpen = openCategories[index] === true;
            return (
              <div key={index} className="commands-category">
                <button
                  className="commands-category-header"
                  onClick={() => toggleCategory(index)}
                >
                  <div className="commands-category-icon">
                    <Terminal size={12} />
                  </div>
                  <span className="commands-category-title">{category.title}</span>
                  <span className="commands-category-count">{category.commands.length}</span>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {isOpen && (
                  <div className="commands-category-content">
                    {category.commands.map((cmd, cmdIndex) => {
                      const isFav = favorites.includes(cmd.id);
                      return (
                        <div key={cmdIndex} className={`commands-item ${isFav ? 'favorite' : ''}`}>
                          <div className="commands-item-header">
                            <div className="commands-item-id">/{cmd.id}</div>
                            <div className="commands-item-actions">
                              <button className="commands-action-btn" onClick={() => handleCopy(cmd.usage || `/${cmd.id}`)}>
                                <Copy size={12} />
                              </button>
                              <button className={`commands-action-btn ${isFav ? 'active' : ''}`} onClick={() => handleToggleFavorite(cmd.id)}>
                                <Star size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="commands-item-description">{cmd.description}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommandsPanel;

