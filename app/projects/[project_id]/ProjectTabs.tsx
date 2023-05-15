'use client';

import CodeTemplate from '@/components/CodeTemplate';
import { jsclientTemplate, rubyTemplate } from '@/lib/configTemplates';
import { project } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
export default function ProjectTabs({ project }: { project: project }) {
  const [selectedTab, setSelectedTab] = useState('ruby');
  const replacements = {
    REPLACE_PROJECT_KEY: project.api_key,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', href: '#', current: true },
    { id: 'activity', name: 'Activity', href: '#', current: false },
    { id: 'settings', name: 'Settings', href: '#', current: false },
    { id: 'collaborators', name: 'Collaborators', href: '#', current: false },
    { id: 'notifications', name: 'Notifications', href: '#', current: false },
  ];

  return (
    <>
      <nav className="flex overflow-x-auto border-b border-white/10 py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
        >
          {tabs.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={item.current ? 'text-indigo-400' : ''}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <pre className="mt-2 block max-w-full overflow-x-auto rounded-md p-4 text-xs">
        {selectedTab === 'ruby' && <CodeTemplate code={rubyTemplate} replacements={replacements} />}
        {selectedTab === 'jsbrowser' && <CodeTemplate code={jsclientTemplate} replacements={replacements} />}
      </pre>
    </>
  );
}
