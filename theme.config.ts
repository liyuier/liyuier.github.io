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
    beian: {
      enable: true,
      icp: '苏ICP备2025165289号',
    },
  },
})
