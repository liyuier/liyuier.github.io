import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://liyuier.github.io/',
  lang: 'zh-CN',
  title: 'yuier',
  author: {
    name: 'yuier',
    avatar: 'https://yui-bucket-1309363843.cos.ap-nanjing.myqcloud.com/avatar1.jpg',
  },
  subtitle: 'yuier 的个人博客',
  description: 'Yuier 的个人博客.',

  social: [
    {
      name: 'GitHub',
      link: 'https://github.com/liyuier',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/428379308',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: false,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: 'https://cdn.yunyoujun.cn/img/donate/alipay-qrcode.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
    ],
  },

  /**
   * 默认 Frontmatter
   */
  frontmatter: {
    time_warning: false,
    author: 'yuier',
  },

  /**
   * 开启阅读统计
   */
  statistics: {
    enable: true,
    readTime: {
      /**
       * 阅读速度
       */
      speed: {
        cn: 300,
        en: 200,
      },
    },
  },

  /**
   * 代码块高度不超过300px
   */
  codeHeightLimit: 1200,
})
