'use client';

import { Dialog, Transition } from '@headlessui/react';
import { project } from '@prisma/client';
import { Button, Flex, Tab, TabList } from '@tremor/react';
import { Fragment, useState } from 'react';
import { BsChevronRight, BsRocketTakeoff } from 'react-icons/bs';
import { MdHttps } from 'react-icons/md';
import { SiJavascript, SiRuby } from 'react-icons/si';
import CodeTemplate from './CodeTemplate';

import { jsclientTemplate, rubyTemplate } from '@/lib/configTemplates';

export default function ProjectDetail({ project }: { project: project }) {
  const [openProject, setOpenProject] = useState<project | null>(null);
  const [selectedTab, setSelectedTab] = useState('ruby');

  function closeModal() {
    setOpenProject(null);
  }
  const replacements = {
    REPLACE_PROJECT_KEY: project.api_key,
  };

  return (
    <>
      <div onClick={() => setOpenProject(project)} className="cursor-pointer">
        <BsChevronRight className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
      </div>

      <Transition appear show={!!openProject} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    <Flex justifyContent="start">
                      <MdHttps className="mr-2 inline-block" size={24} />
                      <span>{openProject?.api_key}</span>
                    </Flex>
                  </Dialog.Title>
                  <p className="mt-2">
                    Airbroke provides an Airbrake-compatible API, allowing you to seamlessly use existing clients. The
                    following are some suggested configurations for your convenience.
                  </p>

                  <TabList defaultValue={selectedTab} onValueChange={(value) => setSelectedTab(value)} className="mt-6">
                    <Tab value="ruby" text="Ruby / Rails" icon={SiRuby} />
                    <Tab value="jsbrowser" text="JavaScript (browser)" icon={SiJavascript} />
                  </TabList>
                  <pre className="mt-2 block max-w-full overflow-x-auto rounded-md p-4 text-xs">
                    {selectedTab === 'ruby' && <CodeTemplate code={rubyTemplate} replacements={replacements} />}
                    {selectedTab === 'jsbrowser' && (
                      <CodeTemplate code={jsclientTemplate} replacements={replacements} />
                    )}
                  </pre>

                  <div className="mt-4">
                    <Flex justifyContent="end" className="space-x-2">
                      <Button icon={BsRocketTakeoff} onClick={closeModal}>
                        Got it, thanks!
                      </Button>
                    </Flex>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
