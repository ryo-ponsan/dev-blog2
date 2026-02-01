export type Project = {
  title: string
  description: string
  imgSrc: string
  href: string
  category: string
}

export type Category = {
  id: string
  label: string
  labelJa: string
}

export const categories: Category[] = [
  { id: 'all', label: 'All', labelJa: 'すべて' },
  { id: 'mobile', label: 'Mobile App', labelJa: 'モバイルアプリ' },
  { id: 'webapp', label: 'Web App', labelJa: 'Webアプリ' },
  { id: 'website', label: 'Web Site', labelJa: 'Webサイト' },
  { id: 'tools', label: 'Dev Tools', labelJa: '開発ツール' },
]

const projectsData: Project[] = [
  // Mobile Apps
  {
    title: '(開発中)PodDiary',
    description: `PodCast(spotify)に特化した日記Androidアプリ。使用技術：Flutter/Django Rest Framework/Render/Supabase(PostgreSQL)`,
    imgSrc: '/static/images/poddiary_sample.png',
    href: 'https://drive.google.com/file/d/1_wAB053VgQ0UU2qM1ceD7zWh4s03zPL3/view?usp=drive_link',
    category: 'mobile',
  },
  {
    title: 'テスト用PodDiary-Webapp',
    description: `PodDiaryのAPI機能テスト用WebApp。使用技術：React, Tailwind CSS`,
    imgSrc: '/static/images/pod-web.png',
    href: 'https://poddiary-web-client-vercel.vercel.app/login',
    category: 'mobile',
  },
  // Web Apps
  {
    title: 'DAO for web3 Hackathon【TOYOTA × KEY3】',
    description: `Web3ハッカソンでの成果物.[Githubリポジトリ](https://github.com/ourTeamDev/DAO-nextjs-thirdweb).[感想ブログ](https://dev-blog-gypsyr.vercel.app/blog/post_230326).`,
    imgSrc: '/static/images/dao_web3.png',
    href: 'https://youtu.be/9B54_ES4tOY',
    category: 'webapp',
  },
  {
    title: 'ICP DEX',
    description: `ICPをバックエンドに独自トークンを板取引するDEXです`,
    imgSrc: '/static/images/icpdex.png',
    href: 'https://qrrbf-ziaaa-aaaao-ahu5a-cai.ic0.app/',
    category: 'webapp',
  },
  // Web Sites
  {
    title: 'Green Cafe Recursion',
    description: `学習コミュニティで出会った方々と作成したwebサイトです。チームリーダーとして取り組みました（https://github.com/greenGitWorkShop/task1）。`,
    imgSrc: '/static/images/green.png',
    href: 'https://greengitworkshop.github.io/task1/index.html',
    category: 'website',
  },
  {
    title: '初代Blog',
    description: `人生初作成したブログ。記念に。`,
    imgSrc: '/static/images/firstBlog.png',
    href: 'https://dev-blog-three-alpha.vercel.app/',
    category: 'website',
  },
  // Dev Tools
  {
    title: 'GPT Repository Loader GUI',
    description: `対話型生成AI向けにユーザーがローカルのGitリポジトリから情報を簡単に抽出・表示できるようにする。gpt_repository_loader.py スクリプト用のStreamlitベースのGUIを提供する。`,
    imgSrc: '/static/images/gpt_loader.png',
    href: 'https://x.com/anderson_Gypsy/status/1829758273802649746',
    category: 'tools',
  },
  {
    title: '論文要約スクリプト',
    description: `論文(PDF)の概要を把握するためのスクリプト。使用技術：LangChain`,
    imgSrc: '/static/images/summarize_book.png',
    href: 'https://github.com/ryo-ponsan/LangChain-tools/blob/main/langchain_research_summarize_example.ipynb',
    category: 'tools',
  },
  {
    title: '動画自動制作スクリプト',
    description: `ショート動画を制作。題材を入力すると、ショート動画が制作できる仕組みを作った。使用技術：moviepy, OpenAI API`,
    imgSrc: '/static/images/tiktok_movie.png',
    href: 'https://www.tiktok.com/@crazy_trivia/video/7336492078186138887?is_from_webapp=1&sender_device=pc&web_id=7320414862378567169',
    category: 'tools',
  },
]

export default projectsData
