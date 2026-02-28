import{_ as m}from"./ValaxyMain.vue_vue_type_style_index_0_lang.CF3jKIAV.js";import{d as h,a as g,u as f}from"./chunks/vue-router.0fijYp3S.js";import{a2 as y,a3 as a,a4 as e,a5 as n,a6 as s,B as _,a1 as b,D as v}from"./framework.CL_twgqk.js";import"./app.DJJRq6_7.js";import"./chunks/dayjs.BFInjCTz.js";import"./chunks/vue-i18n.CRimy4L_.js";import"./chunks/pinia.KHo6empO.js";/* empty css                    */import"./chunks/@vueuse/motion.DON3upiQ.js";import"./chunks/nprogress.DUFFUuWH.js";import"./YunComment.vue_vue_type_style_index_0_lang.lpZGJo7w.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.7-8ddEp8.js";import"./post.D4SLBNdn.js";const x=h("/posts/029-yuni-doc",async i=>JSON.parse('{"title":"使用 nginx 部署子域名服务 —— Yuni 机器人文档的部署","titleTemplate":"%s - yuier","description":"","frontmatter":{"title":"使用 nginx 部署子域名服务 —— Yuni 机器人文档的部署","titleTemplate":"%s - yuier","date":"2026-01-11 03:18:49","updated":"2026-01-11 03:18:49","author":"yuier","categories":["nginx"],"tags":["nginx","vite press"],"cover":null,"hide":null},"headers":[],"relativePath":"pages/posts/029-yuni-doc.md","lastUpdated":1772277401000}'),{lazy:(i,t)=>i.name===t.name}),I={__name:"029-yuni-doc",setup(i,{expose:t}){const{data:p}=x(),c=f(),u=g(),r=Object.assign(u.meta.frontmatter||{},p.value?.frontmatter||{});return c.currentRoute.value.data=p.value,v("valaxy:frontmatter",r),globalThis.$frontmatter=r,t({frontmatter:{title:"使用 nginx 部署子域名服务 —— Yuni 机器人文档的部署",titleTemplate:"%s - yuier",date:"2026-01-11 03:18:49",updated:"2026-01-11 03:18:49",author:"yuier",categories:["nginx"],tags:["nginx","vite press"],cover:null,hide:null}}),(l,o)=>{const d=m;return b(),y(d,{frontmatter:_(r)},{"main-content-md":a(()=>[...o[0]||(o[0]=[n("h2",{id:"背景",tabindex:"-1"},[s("背景 "),n("a",{class:"header-anchor",href:"#背景","aria-label":'Permalink to "背景"'},"​")],-1),n("p",null,[s("搓了小一个月的 "),n("a",{href:"https://github.com/liyuier/Yuni3",target:"_blank",rel:"noreferrer"},"Yuni"),s(" 机器人终于差不多搓完了，决定部署一个文档出来。")],-1),n("p",null,[s("我本身有一个域名和公网服务器，即本站 "),n("a",{href:"https://yuier.com",target:"_blank",rel:"noreferrer"},"yuier.com"),s(" ，因此决定就使用本站的一个子域名来部署文档 "),n("a",{href:"https://yuni.yuier.com",target:"_blank",rel:"noreferrer"},"yuni.yuier.com")],-1),n("h2",{id:"dns-解析",tabindex:"-1"},[s("DNS 解析 "),n("a",{class:"header-anchor",href:"#dns-解析","aria-label":'Permalink to "DNS 解析"'},"​")],-1),n("p",null,"首先在域名注册商处注册新域名与解析",-1),n("p",null,[s("新建一个子域名 "),n("code",null,"yuni.yuier.com"),s(" ，然后在解析控制台 "),n("a",{href:"https://console.cloud.tencent.com/cns",target:"_blank",rel:"noreferrer"},"https://console.cloud.tencent.com/cns"),s(" 为子域名添加一个 A 记录，主机记录我用的 @ ，IP 地址指向服务器公网 IP")],-1),n("figure",null,[n("img",{src:"https://s2.loli.net/2026/01/11/BM3f7tGuq2IZhCK.png",alt:"image.png",loading:"lazy",decoding:"async"})],-1),n("p",null,"随后，根据腾讯云的提示，需要在主域名下添加两条 NS 记录，将子域名注册到两个解析商处",-1),n("figure",null,[n("img",{src:"https://s2.loli.net/2026/01/11/xlCI1O3EvQWug64.png",alt:"image.png",loading:"lazy",decoding:"async"})],-1),n("p",null,[s("（可选）最后，在腾讯云申请子域名的 SSL 证书，腾讯云会自动在 "),n("code",null,"yuni.yuier.com"),s(" 下添加一条名为 "),n("code",null,"_dnsauth"),s(" 的 TXT 记录")],-1),n("figure",null,[n("img",{src:"https://s2.loli.net/2026/01/11/DjhnMwPeBmOqCxY.png",alt:"image.png",loading:"lazy",decoding:"async"})],-1),n("h2",{id:"文档部署",tabindex:"-1"},[s("文档部署 "),n("a",{class:"header-anchor",href:"#文档部署","aria-label":'Permalink to "文档部署"'},"​")],-1),n("h3",{id:"文档引擎",tabindex:"-1"},[s("文档引擎 "),n("a",{class:"header-anchor",href:"#文档引擎","aria-label":'Permalink to "文档引擎"'},"​")],-1),n("p",null,[s("这里我用的是国内开源项目常用的 vite press 作为文档引擎。具体使用方法参考文档 "),n("a",{href:"https://vitepress.dev/zh/",target:"_blank",rel:"noreferrer"},"VitePress 中文文档"),s(" . BTW 具体开发过程中我也抄了挺多 "),n("a",{href:"https://docs.mai-mai.org/",target:"_blank",rel:"noreferrer"},"麦麦机器人文档"),s(" 的写法")],-1),n("h3",{id:"文档部署-1",tabindex:"-1"},[s("文档部署 "),n("a",{class:"header-anchor",href:"#文档部署-1","aria-label":'Permalink to "文档部署"'},"​")],-1),n("p",null,[s("作为静态网页，我部署文档的方式参考本站的部署方式 "),n("a",{href:"https://yuier.com/posts/005-deploy-blog-by-nginx-docker",target:"_blank",rel:"noreferrer"},"使用 nginx - docker 部署博客"),s(" .")],-1),n("p",null,"维护个人远程仓库 —— 使用 post-receive 脚本在线构建 —— 启动 nginx 在指定端口监听域名访问",-1),n("p",null,"这是我的文档服务的 nginx 配置",-1),n("div",{class:"language-conf max-h-900px"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"},"conf"),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"server {")]),s(`
`),n("span",{class:"line"},[n("span",null,"    listen 11461;  # 11451 端口被机器人应用占了（悲）")]),s(`
`),n("span",{class:"line"},[n("span",null,"    listen [::]:11461;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    server_name yuni.yuier.com;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    gzip on;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    index index.html;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    location / {  # 基本就是抄的 vite press 给的示例 https://vitepress.dev/zh/guide/deploy#nginx")]),s(`
`),n("span",{class:"line"},[n("span",null,"        root /usr/share/nginx/html;  # 根目录")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"        try_files $uri $uri.html $uri/ =404;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"        error_page 404 /404.html;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"        error_page 403 /404.html;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"        location ~* ^/assets/ {")]),s(`
`),n("span",{class:"line"},[n("span",null,"            expires 1y;")]),s(`
`),n("span",{class:"line"},[n("span",null,'            add_header Cache-Control "public, immutable";')]),s(`
`),n("span",{class:"line"},[n("span",null,"        }")]),s(`
`),n("span",{class:"line"},[n("span",null,"    }")]),s(`
`),n("span",{class:"line"},[n("span",null,"}")])])]),n("button",{class:"code-block-unfold-btn"})],-1),n("h2",{id:"流量转发",tabindex:"-1"},[s("流量转发 "),n("a",{class:"header-anchor",href:"#流量转发","aria-label":'Permalink to "流量转发"'},"​")],-1),n("p",null,[s("注意到我的文档服务监听的端口在 "),n("code",null,"11461"),s(" ，HTTPS 流量需要经过一层转发。这个转发操作我放到了主域名服务下，并且 SSL 认证也放到了主域名服务下，方便统一管理")],-1),n("p",null,"直接给出主域名服务下的文档流量转发配置",-1),n("div",{class:"language-conf max-h-900px"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"},"conf"),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"server {")]),s(`
`),n("span",{class:"line"},[n("span",null,"    listen 80;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    listen [::]:80;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    server_name yuni.yuier.com;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # 301 永久重定向")]),s(`
`),n("span",{class:"line"},[n("span",null,"    return 301 https://$host$request_uri;")]),s(`
`),n("span",{class:"line"},[n("span",null,"}")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"server {")]),s(`
`),n("span",{class:"line"},[n("span",null,"    listen 443 ssl;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    listen [::]:443 ssl;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    http2 on;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    server_name yuni.yuier.com;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # 文档域名的 SSL 证书")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_certificate /etc/nginx/ssl/yuni/yuni.yuier.com_bundle.crt;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_certificate_key /etc/nginx/ssl/yuni/yuni.yuier.com.key;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # ssl_certificate /etc/nginx/ssl/yuni/fullchain.pem;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # ssl_certificate_key /etc/nginx/ssl/yuni/privkey.pem;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # SSL 协议配置")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_protocols TLSv1.2 TLSv1.3;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_prefer_server_ciphers on;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_session_cache shared:SSL:10m;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_session_timeout 10m;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # 安全响应头")]),s(`
`),n("span",{class:"line"},[n("span",null,'    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";')]),s(`
`),n("span",{class:"line"},[n("span",null,"    add_header X-Content-Type-Options nosniff;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    add_header X-Frame-Options DENY;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # 启用 OCSP Stapling 提升性能")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_stapling on;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    ssl_stapling_verify on;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    resolver 8.8.8.8 1.1.1.1 valid=300s;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    resolver_timeout 5s;")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"    # 反向代理到 yuni.yuier.com 容器")]),s(`
`),n("span",{class:"line"},[n("span",null,"    location / {")]),s(`
`),n("span",{class:"line"},[n("span",null,"        proxy_pass http://yuni-doc:11461;  # 这里需要两个容器在同一个 docker net 下，具体操作可以问 AI")]),s(`
`),n("span",{class:"line"},[n("span",null,"        proxy_set_header Host $host;")]),s(`
`),n("span",{class:"line"},[n("span",null,"        proxy_set_header X-Real-IP $remote_addr;")]),s(`
`),n("span",{class:"line"},[n("span",null,"        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;")]),s(`
`),n("span",{class:"line"},[n("span",null,"        proxy_set_header X-Forwarded-Proto $scheme;")]),s(`
`),n("span",{class:"line"},[n("span",null,"    }")]),s(`
`),n("span",{class:"line"},[n("span",null,"}")])])]),n("button",{class:"code-block-unfold-btn"})],-1),n("h2",{id:"效果",tabindex:"-1"},[s("效果 "),n("a",{class:"header-anchor",href:"#效果","aria-label":'Permalink to "效果"'},"​")],-1),n("p",null,[n("a",{href:"https://yuni.yuier.com/",target:"_blank",rel:"noreferrer"},"https://yuni.yuier.com/")],-1),n("figure",null,[n("img",{src:"https://s2.loli.net/2026/01/11/KI367RqOHuN2iMo.png",alt:"image.png",loading:"lazy",decoding:"async"})],-1)])]),"main-header":a(()=>[e(l.$slots,"main-header")]),"main-header-after":a(()=>[e(l.$slots,"main-header-after")]),"main-nav":a(()=>[e(l.$slots,"main-nav")]),"main-content-before":a(()=>[e(l.$slots,"main-content-before")]),"main-content":a(()=>[e(l.$slots,"main-content")]),"main-content-after":a(()=>[e(l.$slots,"main-content-after")]),"main-nav-before":a(()=>[e(l.$slots,"main-nav-before")]),"main-nav-after":a(()=>[e(l.$slots,"main-nav-after")]),comment:a(()=>[e(l.$slots,"comment")]),footer:a(()=>[e(l.$slots,"footer")]),aside:a(()=>[e(l.$slots,"aside")]),"aside-custom":a(()=>[e(l.$slots,"aside-custom")]),default:a(()=>[e(l.$slots,"default")]),_:3},8,["frontmatter"])}}};export{I as default,x as usePageData};
