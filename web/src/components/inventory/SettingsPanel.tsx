import React, { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectSettingsCategories, selectSettingsValues, selectSettingsLoading, setSettings, setSettingValue, setLoading, SettingCategory } from '../../store/settings';
import { Search, ChevronRight, ChevronDown, Settings } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';

const devSettings: { categories: SettingCategory[]; values: {} } = {
  categories: [
    {
      id: 'ui',
      title: 'Interface',
      settings: [
        {
          id: 'showHud',
          label: 'Show HUD',
          type: 'checkbox' as const,
          defaultValue: true
        },
        {
          id: 'hudOpacity',
          label: 'HUD Opacity',
          type: 'slider' as const,
          min: 0,
          max: 100,
          defaultValue: 100,
          step: 1
        }
      ]
    },
    {
      id: 'audio',
      title: 'Audio',
      settings: [
        {
          id: 'masterVolume',
          label: 'Master Volume',
          type: 'slider' as const,
          min: 0,
          max: 100,
          defaultValue: 50,
          step: 5
        }
      ]
    }
  ],
  values: {}
};

const SettingsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectSettingsCategories);
  const values = useAppSelector(selectSettingsValues);
  const loading = useAppSelector(selectSettingsLoading);
  const [search, setSearch] = useState('');
  const [fetched, setFetched] = useState(false);
  const [openCategories, setOpenCategories] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!fetched && categories.length === 0) {
      dispatch(setLoading(true));
      if (isEnvBrowser()) {
        dispatch(setSettings(devSettings));
        setFetched(true);
      } else {
        Promise.all([
          fetchNui<{ categories: SettingCategory[] }>('getSettingsConfig'),
          fetchNui<{ [categoryId: string]: { [settingId: string]: any } }>('getSettingsValues')
        ]).then(([config, valuesData]) => {
          dispatch(setSettings({
            categories: config?.categories || [],
            values: valuesData || {}
          }));
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
      [index]: prev[index] === undefined ? true : !prev[index]
    }));
  };

  const handleSettingChange = (categoryId: string, settingId: string, value: any) => {
    dispatch(setSettingValue({ categoryId, settingId, value }));
    if (!isEnvBrowser()) {
      fetchNui('setSettingValue', { categoryId, settingId, value });
    }
  };

  const handleResetHudColors = () => {
    if (!isEnvBrowser()) {
      fetchNui('resetHudColors').then(() => {
        Promise.all([
          fetchNui<{ categories: SettingCategory[] }>('getSettingsConfig'),
          fetchNui<{ [categoryId: string]: { [settingId: string]: any } }>('getSettingsValues')
        ]).then(([config, valuesData]) => {
          dispatch(setSettings({
            categories: config?.categories || [],
            values: valuesData || {}
          }));
        });
      });
    }
  };

  const getSettingValue = (categoryId: string, settingId: string, defaultValue: any) => {
    return values[categoryId]?.[settingId] ?? defaultValue;
  };

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.map(category => ({
      ...category,
      settings: category.settings.filter(setting =>
        setting.label.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(category => category.settings.length > 0);
  }, [categories, search]);

  if (loading) {
    return (
      <div className="settings-panel">
        <div className="settings-panel-header">
          <p>Paramètres</p>
        </div>
        <div className="settings-loading">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <p>Paramètres</p>
      </div>

      <div className="settings-search-wrapper">
        <Search size={14} className="settings-search-icon" />
        <input
          type="text"
          className="settings-search-input"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="settings-categories-container">
        {filteredCategories.length === 0 ? (
          <div className="settings-empty">
            <p>Aucun paramètre trouvé</p>
          </div>
        ) : (
          filteredCategories.map((category, catIndex) => {
            const isOpen = openCategories[catIndex] === true;
            return (
              <div key={catIndex} className="settings-category">
                <button
                  className="settings-category-header"
                  onClick={() => toggleCategory(catIndex)}
                >
                  <div className="settings-category-icon">
                    <Settings size={12} />
                  </div>
                  <span className="settings-category-title">{category.title}</span>
                  <span className="settings-category-count">{category.settings.length}</span>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {isOpen && (
                  <div className="settings-category-content">
                    {category.id === 'hudColors' && (
                      <div className="settings-reset-colors">
                        <button
                          className="settings-reset-button"
                          onClick={handleResetHudColors}
                        >
                          Réinitialiser toutes les couleurs
                        </button>
                      </div>
                    )}
                    {category.settings.map((setting, settingIndex) => {
                      const currentValue = getSettingValue(category.id, setting.id, setting.defaultValue);
                      return (
                        <div key={settingIndex} className="settings-item">
                          {setting.type !== 'button' && (
                            <div className="settings-item-label">{setting.label}</div>
                          )}
                          {setting.type === 'checkbox' ? (
                            <label className="settings-checkbox">
                              <input
                                type="checkbox"
                                checked={currentValue === true}
                                onChange={(e) => handleSettingChange(category.id, setting.id, e.target.checked)}
                              />
                              <span className="settings-checkbox-slider"></span>
                            </label>
                          ) : setting.type === 'slider' ? (
                            <div className="settings-slider-wrapper">
                              <input
                                type="range"
                                className="settings-slider"
                                min={setting.min ?? 0}
                                max={setting.max ?? 100}
                                step={setting.step ?? 1}
                                value={currentValue}
                                onChange={(e) => handleSettingChange(category.id, setting.id, parseFloat(e.target.value))}
                              />
                              <span className="settings-slider-value">{currentValue}</span>
                            </div>
                          ) : setting.type === 'select' ? (
                            <select
                              className="settings-select"
                              value={String(currentValue)}
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                const option = setting.options?.find(opt => String(opt.value) === selectedValue);
                                if (option) {
                                  handleSettingChange(category.id, setting.id, option.value);
                                }
                              }}
                            >
                              {setting.options?.map((option, optIndex) => (
                                <option key={optIndex} value={String(option.value)}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : setting.type === 'color' ? (
                            <div className="settings-color-wrapper">
                              <input
                                type="color"
                                className="settings-color-input"
                                value={currentValue || '#FFFFFF'}
                                onChange={(e) => handleSettingChange(category.id, setting.id, e.target.value)}
                              />
                              <span className="settings-color-value">{currentValue || '#FFFFFF'}</span>
                            </div>
                          ) : setting.type === 'button' ? (
                            <button
                              className="settings-button"
                              onClick={() => handleSettingChange(category.id, setting.id, setting.action || '')}
                            >
                              {setting.label}
                            </button>
                          ) : null}
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

export default SettingsPanel;





