'use client';

import { useState, useEffect } from 'react';

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
}

export default function Repositories() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/orgs/openrise-hub/repos')
      .then(res => res.json())
      .then(data => {
        // Filter out the "www" project
        const filteredRepos = Array.isArray(data) ? data.filter((repo: Repository) => repo.name !== 'www') : [];
        setRepos(filteredRepos);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching repos:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="repositories" className="py-20 px-6 border-t border-slate/20">
      <article className="max-w-6xl mx-auto">
        <h2 className="text-base uppercase tracking-[0.25em] text-slate mb-8 font-semibold font-heading">
          Our Projects
        </h2>
        
        {loading ? (
          <p className="text-slate">Loading repositories...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {repos.map(repo => (
              <a 
                key={repo.id} 
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-slate/20 p-6 hover:border-lemon transition-colors cursor-target"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-lemon transition-colors">
                  {repo.name}
                </h3>
                <p className="text-slate text-sm mb-4">{repo.description || 'No description'}</p>
                <div className="flex gap-4 text-xs text-slate/60">
                  {repo.language && <span>{repo.language}</span>}
                  <span>{repo.stargazers_count} stars</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
