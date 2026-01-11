import { defineThemeConfig } from 'valaxy-theme-yun'

export default defineThemeConfig({
  banner: {
    enable: true,
    title: 'Yuier 的个人博客',
  },

  nav: [
    { text: '归档', link: '/archives/', icon: 'i-ri-archive-line' },
    { text: '项目列表', link: '/projects', icon: 'i-ri-gallery-view' },
  ],

  pages: [
    {
      name: '我的小伙伴们',
      url: '/links/',
      icon: 'i-ri-genderless-line',
      color: 'dodgerblue',
    },
  ],

  footer: {
    since: 2025,

    icon: {
      name: 'i-ri-cloud-line',
      animated: true,
      color: 'var(--va-c-primary)',
      url: 'https://github.com/liyuier/liyuier.github.io/blob/master/LICENSE',  // copyright info url
      title: 'LICENSE',
    },

    beian: {
      enable: true,
      icp: '苏ICP备2025165289号',
    },
  },
})
