export type CourseModule = {
  title: string;
  lessons: string[];
  duration: string;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  instructor: string;
  instructorBio: string;
  modules: CourseModule[];
  completionCriteria: string;
  tags: string[];
};

export const courses: Course[] = [
  {
    id: "cognitive-instructor-basic",
    title: "인지학습지도사 기초과정",
    category: "자격과정",
    description: "치매 예방 및 뇌건강 증진을 위한 인지학습지도사 양성 기초 과정입니다.",
    duration: "8주 (총 32시간)",
    price: 580000,
    instructor: "김뇌건강 박사",
    instructorBio: "신경과 전문의, 인지재활학회 정회원",
    modules: [
      { title: "뇌건강 기초 이론", lessons: ["뇌의 구조와 기능", "노화와 인지기능", "치매의 이해"], duration: "4시간" },
      { title: "인지 예비능 개념", lessons: ["인지예비능이란", "인지훈련의 원리", "예방적 접근법"], duration: "4시간" },
      { title: "인지훈련 실습", lessons: ["주의력 훈련", "기억력 훈련", "실행기능 훈련"], duration: "8시간" },
      { title: "프로그램 운영 실무", lessons: ["개별 평가 방법", "그룹 운영 기법", "진행 매뉴얼"], duration: "8시간" },
      { title: "실습 및 평가", lessons: ["시뮬레이션 실습", "사례 발표", "필기평가"], duration: "8시간" },
    ],
    completionCriteria: "출석률 80% 이상, 실습평가 70점 이상, 필기시험 합격",
    tags: ["자격과정", "기초", "인지학습지도사"],
  },
  {
    id: "cognitive-instructor-advanced",
    title: "인지학습지도사 심화과정",
    category: "자격과정",
    description: "기초과정 수료자를 위한 심화 교육과정입니다.",
    duration: "6주 (총 24시간)",
    price: 420000,
    instructor: "이인지 교수",
    instructorBio: "임상심리학 박사, 노인인지재활 전문",
    modules: [
      { title: "고급 인지평가", lessons: ["표준화 검사 도구", "평가 결과 해석", "개별화 계획 수립"], duration: "6시간" },
      { title: "특수 인지훈련", lessons: ["경도인지장애 접근", "치매 초기 대응", "보호자 교육"], duration: "6시간" },
      { title: "기관 운영 실무", lessons: ["프로그램 기획", "인력 관리", "품질 관리"], duration: "6시간" },
      { title: "실습 및 수료평가", lessons: ["기관 현장실습", "사례 보고서", "수료 평가"], duration: "6시간" },
    ],
    completionCriteria: "기초과정 수료, 출석률 80% 이상, 실습평가 70점 이상",
    tags: ["자격과정", "심화", "인지학습지도사"],
  },
  {
    id: "family-caregiver",
    title: "가족 보호자 교육과정",
    category: "일반과정",
    description: "치매 가족 보호자를 위한 실용적인 인지케어 교육입니다.",
    duration: "4주 (총 12시간)",
    price: 180000,
    instructor: "박케어 팀장",
    instructorBio: "노인전문 사회복지사, 치매가족지원사",
    modules: [
      { title: "치매 이해하기", lessons: ["치매의 종류와 증상", "행동심리증상 대응", "의사소통 방법"], duration: "3시간" },
      { title: "일상에서의 인지케어", lessons: ["일상생활 유지법", "인지활동 활용", "환경 조성"], duration: "3시간" },
      { title: "보호자 자기관리", lessons: ["스트레스 관리", "지역 자원 활용", "지지망 구축"], duration: "3시간" },
      { title: "실습", lessons: ["인지활동 체험", "사례 공유", "계획 수립"], duration: "3시간" },
    ],
    completionCriteria: "출석률 80% 이상",
    tags: ["일반과정", "보호자", "가족교육"],
  },
];

export function getCourse(id: string) {
  return courses.find((c) => c.id === id) ?? null;
}
