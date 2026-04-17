import type { BlogPost } from "@/lib/data/posts";
import { posts } from "@/lib/data/posts";
import type { Product } from "@/lib/data/products";
import { products } from "@/lib/data/products";
import { siteConfig } from "@/lib/site";

export type HomepageSectionId =
  | "home-hero"
  | "home-conversion-tracks"
  | "home-services"
  | "home-reserve"
  | "home-products"
  | "home-experience"
  | "home-blog"
  | "home-expert"
  | "home-trust"
  | "home-final-cta";

export type HomepageCtaHref =
  | "/shop"
  | "/contact"
  | "/expert"
  | "/training"
  | "/screening"
  | "/blog"
  | "/programs"
  | "/cognitive-reserve"
  | "/login";

export type HomepageAction = {
  label: string;
  href: HomepageCtaHref;
  variant?: "primary" | "outline" | "soft";
};

export type HomepageFeature = {
  title: string;
  description: string;
  href: HomepageCtaHref;
};

export type HomepageServiceItem = HomepageFeature & {
  eyebrow: string;
  bullets: string[];
  ctaLabel: string;
};

export type HomepageReserveBlock = {
  title: string;
  description: string;
  bullets: string[];
};

export type HomepageBulletList = {
  title: string;
  items: string[];
};

export type HomepageTrustPoint = {
  title: string;
  description: string;
};

export type HomepageExperienceCta = HomepageAction & {
  title: string;
  description: string;
};

export type HomepageSection = {
  id: HomepageSectionId;
  eyebrow?: string;
  title: string;
  description?: string;
};

export type HomepageContent = {
  hero: HomepageSection & {
    actions: HomepageAction[];
    disclaimer: string;
  };
  conversionTracks: HomepageSection & {
    tracks: HomepageFeature[];
  };
  services: HomepageSection & {
    items: HomepageServiceItem[];
  };
  reserve: HomepageSection & {
    actions: HomepageAction[];
    blocks: HomepageReserveBlock[];
  };
  products: HomepageSection & {
    items: Product[];
    action: HomepageAction;
  };
  experience: HomepageSection & {
    actions: HomepageExperienceCta[];
    disclaimer: string;
    bullets: HomepageBulletList[];
  };
  blog: HomepageSection & {
    items: BlogPost[];
    action: HomepageAction;
  };
  expert: HomepageSection & {
    actions: HomepageAction[];
    highlights: string[];
  };
  trust: HomepageSection & {
    points: HomepageTrustPoint[];
  };
  finalCta: HomepageSection & {
    actions: HomepageAction[];
    disclaimer: string;
  };
};

export const homepageSectionOrder: HomepageSectionId[] = [
  "home-hero",
  "home-conversion-tracks",
  "home-services",
  "home-reserve",
  "home-products",
  "home-experience",
  "home-blog",
  "home-expert",
  "home-trust",
  "home-final-cta"
];

export const homepageContent: HomepageContent = {
  hero: {
    id: "home-hero",
    eyebrow: "치매 예방 · 뇌건강 · 인지 예비능",
    title: siteConfig.name,
    description:
      "가정용 교구 탐색부터 기관 도입 문의, 지도사 과정 안내까지 한 번에 비교하고 바로 다음 행동으로 이어질 수 있도록 구성했습니다.",
    actions: [
      { label: "쇼핑몰 보기", href: "/shop" },
      { label: "가맹 문의하기", href: "/contact", variant: "outline" },
      { label: "지도사 과정 보기", href: "/expert", variant: "soft" }
    ],
    disclaimer:
      "안내: 본 사이트의 검사/훈련은 의료 진단이 아닌 참고/체험용이며, 지도사 과정/전문가 흐름은 로그인 또는 승인 후 이어집니다."
  },
  conversionTracks: {
    id: "home-conversion-tracks",
    title: "원하는 출발점을 바로 선택하세요",
    description:
      "방문 목적별 대표 경로만 남겨 빠르게 비교하고 연결할 수 있도록 정리했습니다.",
    tracks: [
      {
        title: "쇼핑몰 보기",
        description: "가정과 기관에서 활용할 수 있는 워크북, 교구, 훈련도구를 바로 살펴봅니다.",
        href: "/shop"
      },
      {
        title: "가맹 문의하기",
        description: "기관 운영, 프로그램 도입, 협업 상담이 필요한 경우 문의 흐름으로 바로 연결합니다.",
        href: "/contact"
      },
      {
        title: "지도사 과정 보기",
        description: "지도사 과정과 전문가용 안내를 먼저 확인하고, 필요한 경우 로그인 또는 승인 후 이어집니다.",
        href: "/expert"
      }
    ]
  },
  services: {
    id: "home-services",
    title: "필요한 서비스를 한눈에 고르세요",
    description:
      "가정, 보호자, 기관 실무자가 많이 찾는 흐름만 추려서 다음 행동이 바로 보이도록 정리했습니다.",
    items: [
      {
        eyebrow: "프로그램 안내",
        title: "프로그램과 서비스 흐름 살펴보기",
        description: "기관 도입 전, 어떤 프로그램이 있는지 먼저 비교하고 상담이 필요한 흐름을 정리해 둔 안내입니다.",
        bullets: [
          "도입 전 참고할 서비스 구성을 빠르게 확인",
          "가정용과 기관용 흐름을 구분해서 보기"
        ],
        href: "/programs",
        ctaLabel: "프로그램 보기"
      },
      {
        eyebrow: "쇼핑",
        title: "교구와 워크북 고르기",
        description: "집이나 기관에서 활용할 수 있는 상품을 둘러보고 필요한 교구를 바로 찾을 수 있습니다.",
        bullets: [
          "대표 상품과 활용 대상을 함께 확인",
          "가볍게 둘러본 뒤 구매 여부를 결정"
        ],
        href: "/shop",
        ctaLabel: "쇼핑몰 보기"
      },
      {
        eyebrow: "체험",
        title: "훈련 체험부터 시작하기",
        description: "처음 방문한 분도 부담 없이 인지훈련 흐름을 경험해 보도록 구성한 참고용 체험 경로입니다.",
        bullets: [
          "짧게 시작해 보는 훈련 경험",
          "어르신과 보호자가 함께 살펴보기 쉬운 흐름"
        ],
        href: "/training",
        ctaLabel: "훈련 체험 보기"
      },
      {
        eyebrow: "전문가 경로",
        title: "지도사·전문가 안내 확인하기",
        description: "전문가센터와 지도사 과정 흐름을 먼저 읽어보고, 필요한 경우 로그인 또는 승인 절차로 이어집니다.",
        bullets: [
          "익명 전체 이용이 아닌 안내 중심 경로",
          "교육 및 운영 관련 흐름을 먼저 파악"
        ],
        href: "/expert",
        ctaLabel: "전문가 안내 보기"
      }
    ]
  },
  reserve: {
    id: "home-reserve",
    eyebrow: "인지 예비능 안내",
    title: "인지 예비능을 어렵지 않게 이해해보세요",
    description:
      "진단이나 판정보다 생활 이해에 초점을 맞춰, 어르신과 보호자가 함께 읽기 쉬운 말로 정리했습니다.",
    actions: [
      { label: "개념 소개 보기", href: "/cognitive-reserve" },
      { label: "문의하기", href: "/contact", variant: "outline" }
    ],
    blocks: [
      {
        title: "인지 예비능 정의",
        description:
          "인지 예비능은 나이가 들거나 환경이 바뀌어도 뇌가 익숙한 기능을 유지하도록 도와주는 생활 속 '여유 힘'으로 이해할 수 있습니다.",
        bullets: [
          "타고난 능력만이 아니라 살아온 경험과 습관이 함께 쌓입니다.",
          "어려운 의학 용어보다 일상에서 기르는 힘으로 생각하면 쉽습니다."
        ]
      },
      {
        title: "왜 중요한지",
        description:
          "평소에 다양한 활동을 이어가면 기억, 집중, 판단 같은 일상 기능을 더 오래 안정적으로 쓰는 데 도움 되는 기반을 만들 수 있습니다.",
        bullets: [
          "어르신 본인은 물론 보호자도 생활 리듬을 점검하는 기준으로 삼기 좋습니다.",
          "특별한 한 가지보다 꾸준한 생활 관리의 중요성을 이해하는 데 도움이 됩니다."
        ]
      },
      {
        title: "실천 방법",
        description:
          "거창한 계획보다 읽기, 대화, 가벼운 운동, 규칙적인 수면처럼 무리 없는 루틴을 천천히 이어가는 방식이 좋습니다.",
        bullets: [
          "하루에 짧게라도 반복할 수 있는 활동부터 시작합니다.",
          "가족이나 이웃과 함께하는 시간도 좋은 생활 자극이 될 수 있습니다."
        ]
      }
    ]
  },
  products: {
    id: "home-products",
    title: "집과 기관에서 활용할 수 있는 상품",
    description:
      "현재 등록된 대표 상품을 바로 확인하고 필요한 교구나 워크북으로 이어갈 수 있습니다.",
    items: products.slice(0, 3),
    action: { label: "전체 상품 보기", href: "/shop", variant: "soft" }
  },
  experience: {
    id: "home-experience",
    title: "체험 흐름은 간단하고 부담 없이 시작할 수 있습니다",
    description:
      "처음 방문한 사용자도 목적에 따라 바로 선택할 수 있도록 참고/체험용 경험 경로를 두 갈래로 정리했습니다.",
    actions: [
      {
        title: "인지훈련 체험",
        description: "짧은 루틴과 활동 예시를 먼저 살펴보고 집에서 가볍게 시작해보는 흐름입니다.",
        label: "훈련 체험 보기",
        href: "/training"
      },
      {
        title: "자가점검 체험",
        description: "현재 상태를 참고용으로 확인해보는 스크리닝 안내 흐름으로 이어집니다.",
        label: "스크리닝 보기",
        href: "/screening",
        variant: "outline"
      }
    ],
    disclaimer:
      "안내: 훈련과 스크리닝은 모두 참고/체험용 흐름이며, 의료적 진단이나 치료 판단을 대신하지 않습니다.",
    bullets: [
      {
        title: "개인 사용자",
        items: [
          "훈련 체험 또는 스크리닝 체험 중 원하는 출발점을 먼저 고른 뒤 필요한 정보와 상품을 이어서 확인합니다.",
          "짧은 루틴으로 시작해 꾸준함을 만드는 참고 동선을 제공합니다."
        ]
      },
      {
        title: "가족·보호자",
        items: [
          "보호자도 이해하기 쉬운 설명과 블로그 글을 통해 일상 참고 자료를 얻을 수 있습니다.",
          "필요한 경우 프로그램 안내나 문의 경로로 자연스럽게 이어집니다."
        ]
      },
      {
        title: "기관·실무자",
        items: [
          "운영 관점에서 프로그램과 전문가용 경로를 먼저 확인할 수 있습니다.",
          "전문가 전용 공간은 로그인 또는 승인 이후 접근하는 흐름을 전제로 안내합니다."
        ]
      }
    ]
  },
  blog: {
    id: "home-blog",
    title: "최근 읽어볼 글",
    description:
      "홈페이지에서 바로 이어볼 수 있도록 최신 공개 글 일부를 노출합니다.",
    items: posts.slice(0, 3),
    action: { label: "블로그 전체 보기", href: "/blog", variant: "outline" }
  },
  expert: {
    id: "home-expert",
    title: "전문가와 기관은 전용 안내 흐름에서 시작합니다",
    description:
      "지도사 과정, 기관 도입 검토, 교육자료 샘플 확인은 `/expert`에서 시작할 수 있지만 전체 자료와 운영 도구는 로그인 또는 승인 이후에만 이어집니다.",
    actions: [
      { label: "지도사 과정 보기", href: "/expert" },
      { label: "로그인하기", href: "/login", variant: "outline" }
    ],
    highlights: [
      "기관 운영자, 강사, 실무자가 과정 소개와 도입 흐름을 먼저 확인할 수 있습니다.",
      "게스트는 전문가센터 소개와 샘플 범위까지만 보고, 전체 자료 열람은 로그인 또는 승인 후 진행됩니다.",
      "기관 검토가 필요한 경우 전문가센터 안내를 읽은 뒤 문의 또는 내부 승인 절차로 이어집니다."
    ]
  },
  trust: {
    id: "home-trust",
    title: "확인 가능한 사실만 기준으로 안내합니다",
    description:
      "후기나 과장 문구 대신 현재 공개 범위, 접근 절차, 이용 기준처럼 홈페이지에서 바로 확인할 수 있는 사실만 정리했습니다.",
    points: [
      {
        title: "참고/체험용 범위를 먼저 밝힙니다",
        description: "홈페이지와 푸터 모두 자가점검과 훈련이 의료 진단을 대신하지 않는 참고/체험용 안내임을 명시합니다."
      },
      {
        title: "전문가 자료는 권한 기반으로 운영합니다",
        description: "공개 페이지에서는 `/expert` 안내를 볼 수 있지만 교육자료 전체와 운영 도구는 로그인 또는 승인 이후 접근하는 흐름으로 설명합니다."
      },
      {
        title: "샘플 자료도 데모 범위를 분명히 적습니다",
        description: "`public/resources/교육자료-샘플.txt`에는 데모용 다운로드 자료이며 실제 운영은 권한 기반 제공이 필요하다고 직접 적혀 있습니다."
      }
    ]
  },
  finalCta: {
    id: "home-final-cta",
    eyebrow: "다음 행동 제안",
    title: "지금 필요한 출발점을 선택해보세요",
    description:
      "개인 사용, 기관 상담, 전문가 과정 확인 중 지금 목적에 맞는 대표 경로만 다시 배치했습니다.",
    actions: [
      { label: "쇼핑몰 보기", href: "/shop" },
      { label: "가맹 문의하기", href: "/contact", variant: "outline" },
      { label: "지도사 과정 보기", href: "/expert", variant: "soft" }
    ],
    disclaimer:
      "전문가 과정과 기관용 자료는 `/expert`에서 안내를 확인한 뒤 로그인 또는 승인 절차로 이어집니다."
  }
};
