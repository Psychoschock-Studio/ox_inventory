import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectWeeklyQuests, selectWeekStart, selectWeeklyQuestsLoading, setWeeklyQuests, setLoading, markQuestCompleted } from '../../store/weeklyQuests';
import { Scroll, Play, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';
import useNuiEvent from '../../hooks/useNuiEvent';

const devQuests = {
  quests: [
    { id: 'test_1', name: 'Livraison Express', description: 'Rendez-vous au point de collecte puis livrez le colis.', completed: false },
    { id: 'test_2', name: 'Patrouille Urbaine', description: 'Effectuez une patrouille en passant par différents checkpoints.', completed: true },
    { id: 'test_3', name: 'Reconnaissance', description: 'Explorez les zones indiquées pour récupérer des informations.', completed: false },
    { id: 'test_4', name: 'Transport VIP', description: 'Escortez un client important à destination.', completed: false },
    { id: 'test_5', name: 'Collecte de ressources', description: 'Récupérez des matériaux dans différents endroits.', completed: true },
  ],
  weekStart: '2024-12-23'
};

const WeeklyQuestsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const quests = useAppSelector(selectWeeklyQuests);
  const weekStart = useAppSelector(selectWeekStart);
  const loading = useAppSelector(selectWeeklyQuestsLoading);
  const [fetched, setFetched] = useState(false);
  const [startingQuest, setStartingQuest] = useState<string | null>(null);

  useEffect(() => {
    if (!fetched && quests.length === 0) {
      dispatch(setLoading(true));
      if (isEnvBrowser()) {
        dispatch(setWeeklyQuests(devQuests));
        setFetched(true);
      } else {
        fetchNui<{ quests: any[]; weekStart: string }>('getWeeklyQuests').then((data) => {
          dispatch(setWeeklyQuests(data || { quests: [], weekStart: '' }));
          setFetched(true);
        }).catch(() => {
          dispatch(setLoading(false));
          setFetched(true);
        });
      }
    }
  }, [fetched, quests.length, dispatch]);

  useNuiEvent<string>('weeklyQuestCompleted', (questId) => {
    dispatch(markQuestCompleted(questId));
  });

  useNuiEvent('weeklyQuestsUpdated', () => {
    setFetched(false);
    dispatch(setWeeklyQuests({ quests: [], weekStart: '' }));
  });

  const handleStartQuest = async (questId: string) => {
    if (startingQuest) return;
    setStartingQuest(questId);
    
    try {
      const result = await fetchNui<boolean>('startWeeklyQuest', { questId });
      if (result) {
        setTimeout(() => {
          fetchNui('exit');
        }, 200);
      }
    } finally {
      setStartingQuest(null);
    }
  };

  const formatWeekDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    
    const formatDay = (d: Date) => d.getDate().toString().padStart(2, '0');
    const formatMonth = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
    
    return `${formatDay(date)}/${formatMonth(date)} - ${formatDay(endDate)}/${formatMonth(endDate)}`;
  };

  const completedCount = quests.filter(q => q.completed).length;

  if (loading) {
    return (
      <div className="weekly-quests-panel">
        <div className="weekly-quests-header">
          <p>Quêtes de la Semaine</p>
        </div>
        <div className="weekly-quests-loading">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-quests-panel">
      <div className="weekly-quests-header">
        <div className="weekly-quests-title-row">
          <Scroll size={16} className="weekly-quests-icon" />
          <p>Quêtes de la Semaine</p>
        </div>
        {weekStart && (
          <div className="weekly-quests-date">
            <Calendar size={12} />
            <span>{formatWeekDate(weekStart)}</span>
          </div>
        )}
      </div>

      <div className="weekly-quests-progress">
        <div className="weekly-quests-progress-text">
          <span>Progression</span>
          <span>{completedCount}/{quests.length}</span>
        </div>
        <div className="weekly-quests-progress-bar">
          <div 
            className="weekly-quests-progress-fill"
            style={{ width: quests.length > 0 ? `${(completedCount / quests.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      <div className="weekly-quests-container">
        {quests.length === 0 ? (
          <div className="weekly-quests-empty">
            <Scroll size={32} />
            <p>Aucune quête disponible cette semaine</p>
          </div>
        ) : (
          quests.map((quest) => (
            <div 
              key={quest.id} 
              className={`weekly-quest-card ${quest.completed ? 'completed' : ''}`}
            >
              <div className="weekly-quest-content">
                <div className="weekly-quest-status">
                  {quest.completed ? (
                    <CheckCircle2 size={18} className="weekly-quest-check" />
                  ) : (
                    <div className="weekly-quest-number">
                      <Scroll size={14} />
                    </div>
                  )}
                </div>
                <div className="weekly-quest-info">
                  <span className={`weekly-quest-name ${quest.completed ? 'strikethrough' : ''}`}>
                    {quest.name}
                  </span>
                  <span className="weekly-quest-description">{quest.description}</span>
                </div>
              </div>
              {!quest.completed && (
                <button 
                  className="weekly-quest-start"
                  onClick={() => handleStartQuest(quest.id)}
                  disabled={startingQuest === quest.id}
                >
                  {startingQuest === quest.id ? (
                    <Clock size={14} className="spinning" />
                  ) : (
                    <Play size={14} />
                  )}
                  <span>{startingQuest === quest.id ? 'Démarrage...' : 'Commencer'}</span>
                </button>
              )}
              {quest.completed && (
                <div className="weekly-quest-completed-badge">
                  <CheckCircle2 size={12} />
                  <span>Terminée</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="weekly-quests-footer">
        <Clock size={12} />
        <span>Les quêtes se renouvellent chaque lundi à 4h</span>
      </div>
    </div>
  );
};

export default WeeklyQuestsPanel;




