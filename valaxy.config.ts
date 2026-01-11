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
