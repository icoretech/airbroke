// lib/integrationsData.ts
import {
  androidTemplate,
  dotNetTemplate,
  goTemplate,
  iosObjectiveCTemplate,
  iosSwiftTemplate,
  javaTemplate,
  jsclientTemplate,
  phpTemplate,
  pythonTemplate,
  rubyTemplate,
} from '@/lib/configTemplates';

import { FaApple } from 'react-icons/fa';
import { SiAndroid, SiDotnet, SiGo, SiJavascript, SiOpenjdk, SiPhp, SiPython, SiRuby, SiSwift } from 'react-icons/si';

import type { IconType } from 'react-icons';

export interface IntegrationItem {
  name: string;
  filename: string;
  language: string;
  code: string;
  icon?: IconType;
}

export const integrations: IntegrationItem[] = [
  {
    name: 'Ruby / Rails',
    filename: 'config/initializers/airbroke.rb',
    language: 'ruby',
    code: rubyTemplate,
    icon: SiRuby,
  },
  {
    name: 'JavaScript (Browser)',
    filename: 'airbroke.js',
    language: 'javascript',
    code: jsclientTemplate,
    icon: SiJavascript,
  },
  {
    name: 'Python',
    filename: 'airbroke.py',
    language: 'python',
    code: pythonTemplate,
    icon: SiPython,
  },
  {
    name: 'iOS / Swift',
    filename: 'AppDelegate.swift',
    language: 'swift',
    code: iosSwiftTemplate,
    icon: SiSwift,
  },
  {
    name: 'iOS / Objective-C',
    filename: 'AppDelegate.m',
    language: 'objectivec',
    code: iosObjectiveCTemplate,
    icon: FaApple,
  },
  {
    name: 'Android',
    filename: 'MainActivity.java',
    language: 'java',
    code: androidTemplate,
    icon: SiAndroid,
  },
  {
    name: '.NET / C#',
    filename: 'Program.cs',
    language: 'csharp',
    code: dotNetTemplate,
    icon: SiDotnet,
  },
  {
    name: 'Go (gobrake)',
    filename: 'main.go',
    language: 'go',
    code: goTemplate,
    icon: SiGo,
  },
  {
    name: 'Java (Javabrake)',
    filename: 'Example.java',
    language: 'java',
    code: javaTemplate,
    icon: SiOpenjdk,
  },
  {
    name: 'PHP',
    filename: 'phpbrake.php',
    language: 'php',
    code: phpTemplate,
    icon: SiPhp,
  },
];
