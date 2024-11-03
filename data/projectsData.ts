const webSites = [
  {
    title: 'Green Cafe Recursion',
    description: `学習コミュニティで出会った方々と作成したwebサイトです。チームリーダーとして取り組みました（https://github.com/greenGitWorkShop/task1）。`,
    imgSrc: '/static/images/green.png',
    href: 'https://greengitworkshop.github.io/task1/index.html',
  },
  {
    title: '初代Blog',
    description: `人生初作成したブログ。記念に。`,
    imgSrc: '',
    href: 'https://dev-blog-gypsyr.vercel.app/',
  },
]
const webApps = [
  {
    title: 'ICP DEX ',
    description: `ICPをバックエンドに独自トークンを板取引するDEXです`,
    imgSrc: '/static/images/icpdex.png',
    href: 'https://qrrbf-ziaaa-aaaao-ahu5a-cai.ic0.app/',
  },
]
const mobileApps = [
  {
    title: '(開発中)PodDiary ',
    description: `PodCast(spotify)に特化した日記Androidアプリ。使用技術：Flutter/Django Rest Framework/Render/Supabase(PostgreSQL)`,
    imgSrc: '',
    href: '',
  },
]
const devTools = [
  {
    title: 'GPT Repository Loader GUI',
    description: `対話型生成AI向けにユーザーがローカルのGitリポジトリから情報を簡単に抽出・表示できるようにする。gpt_repository_loader.py スクリプト用のStreamlitベースのGUIを提供する。`,
    imgSrc: '',
    href: 'https://x.com/anderson_Gypsy/status/1829758273802649746',
  },
  {
    title: '論文要約スクリプト',
    description: `論文(PDF)の概要を把握するためのスクリプト。使用技術：LangChain`,
    imgSrc: '',
    href: 'https://github.com/ryo-ponsan/LangChain-tools/blob/main/langchain_research_summarize_example.ipynb',
  },
]

const projectsData = [
  {
    id: 1,
    header: 'Tools for dev',
    contents: devTools,
  },
  {
    id: 2,
    header: 'Web Site',
    contents: webSites,
  },
  {
    id: 3,
    header: 'Mobile App',
    contents: mobileApps,
  },
  {
    id: 4,
    header: 'Web App',
    contents: webApps,
  },
]

export default projectsData
