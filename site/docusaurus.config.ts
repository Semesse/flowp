/* eslint-disable @typescript-eslint/consistent-type-assertions */
// use esbuild-register to transpile this file before run
import lightCodeTheme from 'prism-react-renderer/themes/nightOwlLight'
import darkCodeTheme from 'prism-react-renderer/themes/nightOwl'
import type { Config, ThemeConfig } from '@docusaurus/types'
import type { Options } from '@docusaurus/preset-classic'

const config: Config = {
  title: 'flowp',
  tagline: 'A Set of Powerful Promise Utilities',
  url: 'https://flowp.pages.dev',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Semesse', // Usually your GitHub org/user name.
  projectName: 'flowp', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/Semesse/flowp/tree/main/site',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } as Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'flowp',
      logo: {
        alt: 'flowp logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'tutorial/intro',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'doc',
          docId: 'api/index',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/Semesse/flowp',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Semesse. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  } as ThemeConfig,
}

module.exports = config
