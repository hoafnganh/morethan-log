const CONFIG = {
  // profile setting (required)
  profile: {
    name: "hoafnganh",
    image: "https://notion-avatar.app/api/svg/eyJmYWNlIjo3LCJub3NlIjoxMywibW91dGgiOjEsImV5ZXMiOjEwLCJleWVicm93cyI6MywiZ2xhc3NlcyI6MiwiaGFpciI6MzQsImFjY2Vzc29yaWVzIjowLCJkZXRhaWxzIjowLCJiZWFyZCI6MCwiZmxpcCI6MCwiY29sb3IiOiJyZ2JhKDI1NSwgMCwgMCwgMCkiLCJzaGFwZSI6Im5vbmUifQ==", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "cyber security learner",
    bio: "Post and Telecommunications Institute of Technology.",
    email: "dhoanganh25705@gmail.com",
    linkedin: "anh-duong-hoang-176294380/",
    github: "hoafnganh",
    instagram: "https://www.instagram.com/hoang.anh.2507/",
  },
  projects: [
    {
      name: `hoafnganh`,
      href: "https://github.com/hoafnganh",
    },
  ],
  // blog setting (required)
  blog: {
    title: "hoafnganh",
    description: "welcome to my blog!",
    scheme: "dark", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://hoafnganh.vercel.app",
  since: 2025, // If leave this empty, current year will be used.
  lang: "vi-VN", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: "2570eda9f07e806aa44ce87761f3a9e5",
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 3, // revalidate time for [slug], index
}

module.exports = { CONFIG }
