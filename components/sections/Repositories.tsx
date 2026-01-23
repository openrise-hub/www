'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
                className="group border border-slate/20 hover:border-lemon transition-colors cursor-target flex flex-col h-80 overflow-hidden bg-background"
              >
                {/* Image Section - 65% */}
                <div className="h-[65%] w-full relative bg-slate/5 p-8 flex items-center justify-center border-b border-slate/10">
                  <div className="relative w-full h-full p-4">
                    <Image 
                      src="/infinite.svg" 
                      alt="Project Preview" 
                      fill
                      className="object-contain opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                    />
                  </div>
                </div>

                {/* Content Section - 35% */}
                <div className="h-[35%] p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-lemon transition-colors line-clamp-1">
                      {repo.name}
                    </h3>
                    <p className="text-slate text-sm line-clamp-3">{repo.description || 'No description'}</p>
                  </div>
                  
                  {repo.language && (
                    <div className="text-xs text-slate/60 mt-4">
                      <span>{repo.language}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
