import{_ as c}from"./ValaxyMain.vue_vue_type_style_index_0_lang.CF3jKIAV.js";import{d as o,a as F,u as y}from"./chunks/vue-router.0fijYp3S.js";import{a2 as u,a3 as n,a4 as e,a5 as s,a6 as i,a7 as E,B as C,a1 as m,D as B}from"./framework.CL_twgqk.js";import"./app.DJJRq6_7.js";import"./chunks/dayjs.BFInjCTz.js";import"./chunks/vue-i18n.CRimy4L_.js";import"./chunks/pinia.KHo6empO.js";/* empty css                    */import"./chunks/@vueuse/motion.DON3upiQ.js";import"./chunks/nprogress.DUFFUuWH.js";import"./YunComment.vue_vue_type_style_index_0_lang.lpZGJo7w.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.7-8ddEp8.js";import"./post.D4SLBNdn.js";const D=o("/posts/005-deploy-blog-by-nginx-docker",async t=>JSON.parse('{"title":"使用 nginx - docker 部署博客","titleTemplate":"%s - yuier","description":"","frontmatter":{"title":"使用 nginx - docker 部署博客","titleTemplate":"%s - yuier","date":"2025-03-25 23:45:36","updated":"2025-03-25 23:45:36","author":"yuier","cover":null,"hide":null},"headers":[],"relativePath":"pages/posts/005-deploy-blog-by-nginx-docker.md","lastUpdated":1772277401000}'),{lazy:(t,p)=>t.name===p.name}),G={__name:"005-deploy-blog-by-nginx-docker",setup(t,{expose:p}){const{data:k}=D(),r=y(),d=F(),h=Object.assign(d.meta.frontmatter||{},k.value?.frontmatter||{});return r.currentRoute.value.data=k.value,B("valaxy:frontmatter",h),globalThis.$frontmatter=h,p({frontmatter:{title:"使用 nginx - docker 部署博客",titleTemplate:"%s - yuier",date:"2025-03-25 23:45:36",updated:"2025-03-25 23:45:36",author:"yuier",cover:null,hide:null}}),(a,l)=>{const g=c;return m(),u(g,{frontmatter:C(h)},{"main-content-md":n(()=>[l[0]||(l[0]=s("p",null,[i("不使用 docker 部署步骤见 "),s("a",{href:"https://yuier.com/posts/002-blog-deploy",target:"_blank",rel:"noreferrer"},"个人博客的搭建与部署"),i(" （不推荐）")],-1)),E(" more "),l[1]||(l[1]=s("h2",{id:"极简版",tabindex:"-1"},[i("极简版 "),s("a",{class:"header-anchor",href:"#极简版","aria-label":'Permalink to "极简版"'},"​")],-1)),l[2]||(l[2]=s("p",null,[i("假设读者已经完成了购买服务器；安装 Linux(Ubuntu) 系统；购买域名；域名备案（如有需要）；申请并下载 ssl 证书；在服务器上配置 git 、node、pnpm 环境；安装 docker 并拉取 "),s("code",null,"nginx:latest"),i(" 镜像；参考 "),s("a",{href:"https://valaxy.site/guide/getting-started",target:"_blank",rel:"noreferrer"},"Valaxy - Getting Started"),i(" 在本地搭建起博客服务等一系列前置工作。")],-1)),l[3]||(l[3]=s("h3",{id:"需要使用的工作目录和文件",tabindex:"-1"},[i("需要使用的工作目录和文件 "),s("a",{class:"header-anchor",href:"#需要使用的工作目录和文件","aria-label":'Permalink to "需要使用的工作目录和文件"'},"​")],-1)),l[4]||(l[4]=s("blockquote",null,[s("p",null,"免责声明：以下所有目录具体路径选择理由均为俺寻思这么整能行，并不代表笔者认定以下为最佳实践")],-1)),l[5]||(l[5]=s("h4",{id:"git-工作流",tabindex:"-1"},[i("git 工作流 "),s("a",{class:"header-anchor",href:"#git-工作流","aria-label":'Permalink to "git 工作流"'},"​")],-1)),l[6]||(l[6]=s("p",null,"我的持续部署思路是这样的：本地修改好 blog —— 通过 git 推送到服务器上的远程仓 —— 在远程仓上使用 git hooks 完成仓库 pull 到（服务器上的）本地并构建 —— 最终将构建产物复制到 nginx 工作目录（的挂载目录下）",-1)),l[7]||(l[7]=s("p",null,[s("s",null,"正如上面所说，我选择这套工作流的理由也是俺寻思这么整能行")],-1)),l[8]||(l[8]=s("ul",null,[s("li",null,[s("p",null,"git 远程仓库，用于本地修改 blog 后将代码推送到服务器"),s("p",null,[i("参考 "),s("a",{href:"https://yuier.com/posts/001-build-self-gitrepo-server",target:"_blank",rel:"noreferrer"},"搭建自己的 git 远程仓库服务"),i(" ，最终在 "),s("code",null,"/home/git/repos/liyuier.github.io.git"),i(" 下搭建起博客的远程仓库")]),s("p",null,[i("在本地博客仓库，使用 "),s("code",null,"git remote add"),i(" 命令将该仓库添加为本地仓的远程仓库。我这里将其命名为 "),s("code",null,"yuier")]),s("div",{class:"language-bash max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"$"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," git"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," remote"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -v")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"origin"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"  git@github.com:liyuier/liyuier.github.io.git"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (fetch)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"origin"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"  git@github.com:liyuier/liyuier.github.io.git"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (push)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"yuier"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   git@yuier.com:/home/git/repos/liyuier.github.io.git"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (fetch)  "),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 这里就是远程仓")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"yuier"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   git@yuier.com:/home/git/repos/liyuier.github.io.git"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (push)")])])]),s("button",{class:"code-block-unfold-btn"})])]),s("li",null,[s("p",null,"服务器构建工作目录"),s("p",null,[i("本地代码推送到远程仓后，通过 "),s("code",null,"git hooks"),i(" 脚本将代码 pull 到服务器上另一个目录下并执行构建工作")]),s("p",null,[i("这里我选择放在 "),s("code",null,"/usr/dev/blog/liyuier.github.io")])]),s("li",null,[s("p",null,"构建结果存放目录"),s("p",null,[i("构建完毕后，再次将 "),s("code",null,"dist"),i(" 目录下的构建产物复制到第三个目录下，第三个目录会在 nginx 容器启动时挂载为容器内 nginx 的工作目录，于是 nginx 容器便可以以我们的构建产物启动服务")]),s("p",null,[i("这个目录我选择 "),s("code",null,"/srv/blog/nginx/html")])]),s("li",null,[s("p",null,"git hooks"),s("p",null,[i("在 "),s("code",null,"/home/git/repos/liyuier.github.io.git/hooks"),i(" 目录下，新建一个名为 "),s("code",null,"post-receive"),i(" 的文件。该文件会在接收到 git 推送后自动执行。")]),s("div",{class:"language-bash max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 定义日志文件路径（推荐存放在 git 用户有权限的目录）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOG_FILE"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/home/git/logs/blog_deploy.log"')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEPLOY_LOG_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$("),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"dirname"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$LOG_FILE"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 创建日志目录（如果不存在）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"mkdir"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -p"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$DEPLOY_LOG_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"sudo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," chown"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," git:git"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$DEPLOY_LOG_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"'),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 确保目录所有权")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 重定向所有输出到日志文件（追加模式）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"exec"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," >>"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$LOG_FILE"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"'),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," 2>&1")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 添加时间戳分隔符")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -e"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "\\n\\n=== $('),s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"date"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},` '+%Y-%m-%d %H:%M:%S') 开始部署 ==="`)]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"#!/bin/bash  # 指定使用 bash shell 解释器")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 定义变量：工作目录路径（必须与之前创建的目录一致）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"TARGET"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/usr/dev/blog/liyuier.github.io"')]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 定义变量：Nginx 的网站根目录（最终部署位置）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DEPLOY_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/srv/blog/nginx/html"')]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 定义变量：Git 裸仓库路径（用于 git 命令操作）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"GIT_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/home/git/repos/liyuier.github.io.git"')]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "➜ Starting auto deployment..."'),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 输出开始提示信息")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 强制检出代码到工作目录（--work-tree 指定工作区，--git-dir 指定仓库位置）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"git"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --work-tree="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$TARGET"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --git-dir="),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$GIT_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," checkout"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -f")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 切换到工作目录（准备执行构建命令）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"cd"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $TARGET")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 安装依赖（--frozen-lockfile 表示严格使用 lock 文件版本，避免版本冲突）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"pnpm"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," install"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --frozen-lockfile")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 执行构建命令（根据项目配置，生成 dist/ 目录）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"pnpm"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," run"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," build")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 清理旧的部署文件（避免残留文件干扰）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"sudo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," rm"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -rf"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $DEPLOY_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 递归复制构建结果到 Nginx 目录（-a 参数保留文件属性）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"sudo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," cp"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -a"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," dist/"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"*"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $DEPLOY_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 修改部署目录所有权（假设 Nginx 以 www-data 用户运行）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 感觉用 docker 部署的话，这一步没必要")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# sudo chown -R root $DEPLOY_DIR")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "✅ Deployment completed! Nginx content updated."'),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 输出完成提示")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 检查配置语法")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 定义变量")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"CONTAINER_NAME"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"blog"'),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 替换为你的容器名称或ID")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 检查 Nginx 配置文件语法")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"sudo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," docker"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," exec"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $CONTAINER_NAME "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"nginx"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -t"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," >"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," /dev/null"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," 2>&1")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 判断命令执行结果")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"if"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," [ "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"$?"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -eq"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 0"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," ]; "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"then")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"    echo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "Nginx 配置文件语法正确"')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"else")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"    echo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "Nginx 配置文件语法错误，请检查！"')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"    exit"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 1")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"fi")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 执行重载")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"sudo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," docker"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," exec"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $CONTAINER_NAME "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"nginx"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -s"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," reload")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "🔄 Nginx 已平滑重载"')])])]),s("button",{class:"code-block-unfold-btn"})]),s("p",null,[i("脚本中有很多 "),s("code",null,"sudo"),i(" 命令，为了使脚本执行时不需要输入密码，需要修改 "),s("code",null,"sudoers"),i(" 文件。具体方法可以参考 "),s("a",{href:"https://bingozb.github.io/views/default/58.html",target:"_blank",rel:"noreferrer"},"让Linux用户sudo操作免密码"),i(" .")])])],-1)),l[9]||(l[9]=s("h4",{id:"nginx-容器",tabindex:"-1"},[i("nginx 容器 "),s("a",{class:"header-anchor",href:"#nginx-容器","aria-label":'Permalink to "nginx 容器"'},"​")],-1)),l[10]||(l[10]=s("p",null,"这部分，我们需要准备 nginx 容器启动脚本、nginx 配置文件、nginx 容器挂载目录等。",-1)),l[11]||(l[11]=s("p",null,"这些就不解释了，通用做法。",-1)),l[12]||(l[12]=s("ul",null,[s("li",null,[s("p",null,"nginx 挂载目录"),s("p",null,"上文中我们准备的构建结果存放目录其实就是整个挂载目录 “套装” 的一部分。完整的环境是这样的："),s("div",{class:"language-bash max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"$"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," pwd")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"/srv/blog/nginx")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"$"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," tree"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -L"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 1")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},".")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," conf.d")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   └──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," blog.conf"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 博客服务配置")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," html")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   ├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," index.html"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 构建产物")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   ├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ...")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," logs")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   ├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," access.log"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 访问日志")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   ├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," error.log"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 各等级日志")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   ├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," info.log")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   └──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," notice.log")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," mime.types"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 指定不同类型资源处理方式的文件，具体可以问大模型")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," nginx.conf"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 主配置")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ssl")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   ├──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," yuier.com_bundle.crt"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # ssl 证书文件")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"│"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"   └──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," yuier.com.key")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"└──"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," start.sh"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # nginx docker 启动脚本")])])]),s("button",{class:"code-block-unfold-btn"})])]),s("li",null,[s("p",null,"各文件内容"),s("ul",null,[s("li",null,[s("p",null,"blog.conf"),s("div",{class:"language-conf max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"conf"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"# 强制 HTTP 跳转 HTTPS（重要！）")]),i(`
`),s("span",{class:"line"},[s("span",null,"server {")]),i(`
`),s("span",{class:"line"},[s("span",null,"    listen 80;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    server_name yuier.com;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    # 301 永久重定向")]),i(`
`),s("span",{class:"line"},[s("span",null,"    return 301 https://$host$request_uri;")]),i(`
`),s("span",{class:"line"},[s("span",null,"}")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"#HTTPS服务器")]),i(`
`),s("span",{class:"line"},[s("span",null,"server {")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    listen 443 ssl;  # 启用 HTTP/2")]),i(`
`),s("span",{class:"line"},[s("span",null,"    server_name yuier.com;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    ")]),i(`
`),s("span",{class:"line"},[s("span",null,"    # SSL 证书配置（请修改为你的实际路径）")]),i(`
`),s("span",{class:"line"},[s("span",null,"    ssl_certificate /etc/nginx/ssl/yuier.com_bundle.crt;  # 证书链文件")]),i(`
`),s("span",{class:"line"},[s("span",null,"    ssl_certificate_key /etc/nginx/ssl/yuier.com.key;  # 私钥文件")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    # 启用 OCSP Stapling 提升性能")]),i(`
`),s("span",{class:"line"},[s("span",null,"    ssl_stapling on;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    ssl_stapling_verify on;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    resolver 8.8.8.8 1.1.1.1 valid=300s;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    resolver_timeout 5s;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    # 安全响应头")]),i(`
`),s("span",{class:"line"},[s("span",null,'    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";')]),i(`
`),s("span",{class:"line"},[s("span",null,"    add_header X-Content-Type-Options nosniff;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    add_header X-Frame-Options DENY;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    gzip on;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    index index.html;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    location / {")]),i(`
`),s("span",{class:"line"},[s("span",null,"        # content location")]),i(`
`),s("span",{class:"line"},[s("span",null,"        # root /app;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        root /usr/share/nginx/html;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        # exact matches -> reverse clean urls -> folders -> not found")]),i(`
`),s("span",{class:"line"},[s("span",null,"        try_files $uri $uri.html $uri/ =404;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        # non existent pages")]),i(`
`),s("span",{class:"line"},[s("span",null,"        error_page 404 /404.html;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        # a folder without index.html raises 403 in this setup")]),i(`
`),s("span",{class:"line"},[s("span",null,"        error_page 403 /404.html;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        # adjust caching headers")]),i(`
`),s("span",{class:"line"},[s("span",null,"        # files in the assets folder have hashes filenames")]),i(`
`),s("span",{class:"line"},[s("span",null,"        location ~* ^/assets/ {")]),i(`
`),s("span",{class:"line"},[s("span",null,"            expires 1y;")]),i(`
`),s("span",{class:"line"},[s("span",null,'            add_header Cache-Control "public, immutable";')]),i(`
`),s("span",{class:"line"},[s("span",null,"        }")]),i(`
`),s("span",{class:"line"},[s("span",null,"    }")]),i(`
`),s("span",{class:"line"},[s("span",null,"}")])])]),s("button",{class:"code-block-unfold-btn"})])]),s("li",null,[s("p",null,"mime.types"),s("div",{class:"language-types max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"types"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"types {")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/html                             html htm shtml;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/css                              css;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/xml                              xml;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/gif                             gif;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/jpeg                            jpeg jpg;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/javascript                js;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/atom+xml                  atom;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/rss+xml                   rss;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/mathml                           mml;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/plain                            txt;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/vnd.sun.j2me.app-descriptor      jad;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/vnd.wap.wml                      wml;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        text/x-component                      htc;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/png                             png;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/tiff                            tif tiff;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/vnd.wap.wbmp                    wbmp;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/x-icon                          ico;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/x-jng                           jng;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/x-ms-bmp                        bmp;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/svg+xml                         svg svgz;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        image/webp                            webp;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/font-woff                 woff;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/java-archive              jar war ear;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/json                      json;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/mac-binhex40              hqx;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/msword                    doc;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/pdf                       pdf;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/postscript                ps eps ai;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/rtf                       rtf;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.apple.mpegurl         m3u8;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.ms-excel              xls;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.ms-fontobject         eot;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.ms-powerpoint         ppt;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.wap.wmlc              wmlc;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.google-earth.kml+xml  kml;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.google-earth.kmz      kmz;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-7z-compressed           7z;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-cocoa                   cco;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-java-archive-diff       jardiff;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-java-jnlp-file          jnlp;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-makeself                run;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-perl                    pl pm;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-pilot                   prc pdb;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-rar-compressed          rar;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-redhat-package-manager  rpm;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-sea                     sea;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-shockwave-flash         swf;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-stuffit                 sit;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-tcl                     tcl tk;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-x509-ca-cert            der pem crt;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/x-xpinstall               xpi;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/xhtml+xml                 xhtml;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/xspf+xml                  xspf;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/zip                       zip;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/octet-stream              bin exe dll;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/octet-stream              deb;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/octet-stream              dmg;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/octet-stream              iso img;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/octet-stream              msi msp msm;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.openxmlformats-officedocument.wordprocessingml.document    docx;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet          xlsx;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        application/vnd.openxmlformats-officedocument.presentationml.presentation  pptx;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        audio/midi                            mid midi kar;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        audio/mpeg                            mp3;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        audio/ogg                             ogg;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        audio/x-m4a                           m4a;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        audio/x-realaudio                     ra;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/3gpp                            3gpp 3gp;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/mp2t                            ts;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/mp4                             mp4;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/mpeg                            mpeg mpg;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/quicktime                       mov;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/webm                            webm;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/x-flv                           flv;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/x-m4v                           m4v;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/x-mng                           mng;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/x-ms-asf                        asx asf;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/x-ms-wmv                        wmv;")]),i(`
`),s("span",{class:"line"},[s("span",null,"        video/x-msvideo                       avi;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    }")])])]),s("button",{class:"code-block-unfold-btn"})])]),s("li",null,[s("p",null,"nginx.conf"),s("p",null,"其实这个文件是先简单 docker run 起一个容器，然后用"),s("blockquote",null,[s("p",null,"docker cp <容器ID或名称>:<容器内的路径> <主机上的目标路径>")]),s("p",null,"命令复制出来的。"),s("div",{class:"language-conf max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"conf"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"user  nginx;")]),i(`
`),s("span",{class:"line"},[s("span",null,"worker_processes  auto;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"error_log  /var/log/nginx/error.log notice;")]),i(`
`),s("span",{class:"line"},[s("span",null,"pid        /var/run/nginx.pid;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"events {")]),i(`
`),s("span",{class:"line"},[s("span",null,"    worker_connections  1024;")]),i(`
`),s("span",{class:"line"},[s("span",null,"}")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"http {")]),i(`
`),s("span",{class:"line"},[s("span",null,"    include       /etc/nginx/mime.types;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    default_type  application/octet-stream;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,`    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '`)]),i(`
`),s("span",{class:"line"},[s("span",null,`                    '$status $body_bytes_sent "$http_referer" '`)]),i(`
`),s("span",{class:"line"},[s("span",null,`                    '"$http_user_agent" "$http_x_forwarded_for"';`)]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    access_log  /var/log/nginx/access.log  main;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    sendfile        on;")]),i(`
`),s("span",{class:"line"},[s("span",null,"    #tcp_nopush     on;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    keepalive_timeout  65;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    #gzip  on;")]),i(`
`),s("span",{class:"line"},[s("span")]),i(`
`),s("span",{class:"line"},[s("span",null,"    # 将 conf.d 目录下所有文件都 include 进来。即上文中的 blog.conf 文件就会被 include")]),i(`
`),s("span",{class:"line"},[s("span",null,"    include /etc/nginx/conf.d/*.conf;")]),i(`
`),s("span",{class:"line"},[s("span",null,"}")])])]),s("button",{class:"code-block-unfold-btn"})])]),s("li",null,[s("p",null,"start.sh"),s("div",{class:"language-bash max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"#!/bin/bash")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 该脚本会以 nginx:latest 镜像启动一个名为 blog 的容器")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 如果下述命令执行时存在权限问题，就都改成 sudo 好了")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 定义本地路径变量（按实际路径修改！）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_NGINX_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/srv/blog/nginx"'),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"  # 替换为你的实际路径")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_CONF_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_NGINX_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}/conf.d"')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_LOGS_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_NGINX_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}/logs"')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_SSL_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_NGINX_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}/ssl"')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_HTML_DIR"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_NGINX_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}/html"')]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 检查本地目录是否存在，不存在则创建")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"mkdir"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -p"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$LOCAL_CONF_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"'),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$LOCAL_LOGS_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"'),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$LOCAL_SSL_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"')]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 停止并删除旧容器（防止冲突）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"docker"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," stop"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," blog"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," >"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/dev/null"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," 2>&1")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"docker"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," rm"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," blog"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," >"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"/dev/null"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," 2>&1")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 启动Nginx容器（关键修正点）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# -p 选项用于映射端口；冒号前为主机端口，冒号后为容器端口")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# -v 选项用于挂载路径；冒号前为主机路径，冒号后为容器路径")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"docker"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," run"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -d"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"--name "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"blog"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-p "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"80:80"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-p "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"443:443"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-v "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_CONF_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}:/etc/nginx/conf.d"'),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-v "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_NGINX_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}/nginx.conf:/etc/nginx/nginx.conf"'),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-v "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_NGINX_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}/mime.types:/etc/nginx/mime.types"'),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-v "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_SSL_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}:/etc/nginx/ssl"'),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-v "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_LOGS_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}:/var/log/nginx"'),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"-v "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"${'),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCAL_HTML_DIR"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'}:/usr/share/nginx/html"'),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," \\")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"nginx:latest  "),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 确保镜像名称正确！")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 检查容器状态")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# --------------------------------------------")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "检查容器状态："')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"docker"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," ps"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -f"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," name=blog")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 查看日志（调试用）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"echo"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -e"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' "\\n查看容器日志："')]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"docker"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," logs"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," blog"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --tail"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 50")])])]),s("button",{class:"code-block-unfold-btn"})])])])])],-1)),l[13]||(l[13]=s("h3",{id:"blog-启动",tabindex:"-1"},[i("Blog，启动！ "),s("a",{class:"header-anchor",href:"#blog-启动","aria-label":'Permalink to "Blog，启动！"'},"​")],-1)),l[14]||(l[14]=s("p",null,[i("万事俱备。首先执行 "),s("code",null,"./start.sh"),i(" 启动容器，访问 "),s("code",null,"your-site.domain"),i(" 确认 nginx 容器正常工作。")],-1)),l[15]||(l[15]=s("p",null,"然后本地修改 blog ，完成后使用",-1)),l[16]||(l[16]=s("div",{class:"language-bash max-h-900px"},[s("button",{title:"Copy code",class:"copy"}),s("span",{class:"lang"},"bash"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 因为这是我自己用的项目，所以直接用 -f 推 master 分支。反正在 github 那边还有个备份")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# （虽然 github 那边同样用的 -f 推 master ，笑）")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"git"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," push"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -f"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," yuier"),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," master")])])]),s("button",{class:"code-block-unfold-btn"})],-1)),l[17]||(l[17]=s("p",null,"命令将修改推送到服务器上的远程仓，触发 git hooks 脚本，并实现自动构建、部署。",-1)),l[18]||(l[18]=s("p",null,"读者当前看到的网站就是通过这种方式部署的。",-1))]),"main-header":n(()=>[e(a.$slots,"main-header")]),"main-header-after":n(()=>[e(a.$slots,"main-header-after")]),"main-nav":n(()=>[e(a.$slots,"main-nav")]),"main-content-before":n(()=>[e(a.$slots,"main-content-before")]),"main-content":n(()=>[e(a.$slots,"main-content")]),"main-content-after":n(()=>[e(a.$slots,"main-content-after")]),"main-nav-before":n(()=>[e(a.$slots,"main-nav-before")]),"main-nav-after":n(()=>[e(a.$slots,"main-nav-after")]),comment:n(()=>[e(a.$slots,"comment")]),footer:n(()=>[e(a.$slots,"footer")]),aside:n(()=>[e(a.$slots,"aside")]),"aside-custom":n(()=>[e(a.$slots,"aside-custom")]),default:n(()=>[e(a.$slots,"default")]),_:3},8,["frontmatter"])}}};export{G as default,D as usePageData};
