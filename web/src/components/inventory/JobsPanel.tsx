import React, { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectJobCategories, selectJobsJoinButtonLabel, selectJobsLoading, setJobs, setLoading, JobCategory } from '../../store/jobs';
import { Search, ChevronRight, Briefcase, Play } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import { isEnvBrowser } from '../../utils/misc';

const devJobs = {
  categories: [
    {
      title: 'Emergency Services',
      jobs: [
        {
          id: 'police',
          name: 'Police Officer',
          description: 'Protect and serve the community',
          image: 'https://i.imgur.com/8Km9tLL.png',
          event: 'jobs:joinPolice',
          args: { rank: 'recruit' }
        },
        {
          id: 'ems',
          name: 'Paramedic',
          description: 'Save lives and provide medical assistance',
          eventServer: 'jobs:joinEMS',
          args: { department: 'hospital' }
        }
      ]
    },
    {
      title: 'Civilian Jobs',
      jobs: [
        {
          id: 'mechanic',
          name: 'Mechanic',
          description: 'Repair and customize vehicles',
          event: 'jobs:joinMechanic',
          args: {}
        }
      ]
    }
  ],
  joinButtonLabel: 'Join the activity'
};

const JobsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectJobCategories);
  const joinButtonLabel = useAppSelector(selectJobsJoinButtonLabel);
  const loading = useAppSelector(selectJobsLoading);
  const [search, setSearch] = useState('');
  const [fetched, setFetched] = useState(false);
  const [openCategories, setOpenCategories] = useState<{ [key: number]: boolean }>({ 0: true });

  useEffect(() => {
    if (!fetched && categories.length === 0) {
      dispatch(setLoading(true));
      if (isEnvBrowser()) {
        dispatch(setJobs(devJobs));
        setFetched(true);
      } else {
        fetchNui<{ categories: JobCategory[]; joinButtonLabel?: string }>('getJobs').then((data) => {
          dispatch(setJobs(data || { categories: [] }));
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

  const handleJoinJob = (job: { id: string }) => {
    fetchNui('triggerJobEvent', { jobId: job.id });
  };

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.map(cat => ({
      ...cat,
      jobs: cat.jobs.filter(job =>
        job.name.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.id.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(cat => cat.jobs.length > 0);
  }, [categories, search]);

  if (loading) {
    return (
      <div className="jobs-panel">
        <div className="jobs-panel-header">
          <p>Jobs</p>
        </div>
        <div className="jobs-loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-panel">
      <div className="jobs-panel-header">
        <p>Jobs</p>
      </div>

      <div className="jobs-search-wrapper">
        <Search size={14} className="jobs-search-icon" />
        <input
          type="text"
          className="jobs-search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="jobs-categories-container">
        {filteredCategories.length === 0 ? (
          <div className="jobs-empty">
            <p>No jobs found</p>
          </div>
        ) : (
          filteredCategories.map((category, catIndex) => (
            <div key={catIndex} className="jobs-category">
              <button className="jobs-category-header" onClick={() => toggleCategory(catIndex)}>
                <div className="jobs-category-icon">
                  <Briefcase size={12} />
                </div>
                <span className="jobs-category-title">{category.title}</span>
                <span className="jobs-category-count">{category.jobs.length}</span>
                <ChevronRight
                  size={14}
                  style={{
                    transform: openCategories[catIndex] ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                    opacity: 0.5
                  }}
                />
              </button>
              {openCategories[catIndex] && (
                <div className="jobs-category-content">
                  {category.jobs.map((job, jobIndex) => (
                    <div key={jobIndex} className="jobs-item">
                      <div className="jobs-item-content">
                        {job.image && (
                          <div className="jobs-item-image">
                            <img
                              src={job.image}
                              alt={job.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="jobs-item-info">
                          <span className="jobs-item-name">{job.name}</span>
                          <span className="jobs-item-description">{job.description}</span>
                        </div>
                      </div>
                      <button className="jobs-item-join" onClick={() => handleJoinJob(job)}>
                        <Play size={10} />
                        <span>{joinButtonLabel}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsPanel;

