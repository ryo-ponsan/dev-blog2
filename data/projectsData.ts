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
    title: 'DAO for web3 Hackathon【TOYOTA × KEY3】 ',
    description: `Web3ハッカソンでの成果物.[Githubリポジトリ](https://github.com/ourTeamDev/DAO-nextjs-thirdweb).[感想ブログ](https://dev-blog-gypsyr.vercel.app/blog/post_230325).`,
    imgSrc: '/static/images/dao_web3.png',
    href: 'https://youtu.be/9B54_ES4tOY',
  },
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
    imgSrc: '/static/images/poddiary_sample.png',
    href: 'https://drive.google.com/drive/u/0/folders/1FraFzg_VaGbWQ-9kaD6jxBFOZWZRaMqJ',
  },
]
const devTools = [
  {
    title: 'GPT Repository Loader GUI',
    description: `対話型生成AI向けにユーザーがローカルのGitリポジトリから情報を簡単に抽出・表示できるようにする。gpt_repository_loader.py スクリプト用のStreamlitベースのGUIを提供する。`,
    imgSrc: '/static/images/gpt_loader.png',
    href: 'https://x.com/anderson_Gypsy/status/1829758273802649746',
  },
  {
    title: '論文要約スクリプト',
    description: `論文(PDF)の概要を把握するためのスクリプト。使用技術：LangChain`,
    imgSrc: '/static/images/summarize_book.png',
    href: 'https://github.com/ryo-ponsan/LangChain-tools/blob/main/langchain_research_summarize_example.ipynb',
  },
  {
    title: '動画自動制作スクリプト',
    description: `ショート動画を制作。題材を入力すると、ショート動画が制作できる仕組みを作った。使用技術：moviepy, OpenAI API`,
    imgSrc: '/static/images/tiktok_movie.png',
    href: 'https://www.tiktok.com/@crazy_trivia/video/7336492078186138887?is_from_webapp=1&sender_device=pc&web_id=7320414862378567169',
  },
]

const projectsData = [
  {
    id: 1,
    header: 'Mobile App',
    contents: mobileApps,
  },
  {
    id: 2,
    header: 'Web SiteWeb App',
    contents: webApps,
  },
  {
    id: 3,
    header: 'Web Site',
    contents: webSites,
  },
  {
    id: 4,
    header: 'TTools for dev',
    contents: devTools,
  },
]

export default projectsData