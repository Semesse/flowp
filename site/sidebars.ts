/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

import { SidebarsConfig } from '@docusaurus/plugin-content-docs'
import api from './docs/api/sidebar'

const sidebars: SidebarsConfig = {
  tutorialSidebar: [{ type: 'autogenerated', dirName: 'tutorial' }],
  apiSidebar: api as any,
}

module.exports = sidebars
