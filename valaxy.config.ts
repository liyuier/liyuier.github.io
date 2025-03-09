import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: 'Yuier 的个人博客',
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      // {
      //   name: '喜欢的女孩子',
      //   url: '/girls/',
      //   icon: 'i-ri-women-line',
      //   color: 'hotpink',
      // },
    ],

    footer: {
      since: 2025,
      beian: {
        enable: true,
        icp: '苏ICP备2025165289号',
      },
    },

    say: {
      enable: true,
      api: 'https://v1.hitokoto.cn',
      hitokoto: {
        enable: true,
        api: 'https://v1.hitokoto.cn',
      }
    },
  },

  unocss: { safelist },
})
