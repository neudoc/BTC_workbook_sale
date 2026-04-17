export type ScreeningQuestion = {
  id: string;
  domain: string;
  domainKo: string;
  text: string;
  type: "choice" | "input";
  options?: { label: string; value: string; score: number }[];
  maxScore: number;
};

export type ScreeningTest = {
  id: string;
  title: string;
  description: string;
  disclaimer: string;
  questions: ScreeningQuestion[];
  maxScore: number;
};

export const cognitiveTest: ScreeningTest = {
  id: "cognitive-comprehensive",
  title: "인지종합검사",
  description: "기억력, 주의력, 언어능력 등 인지 기능 전반을 평가하는 종합 검사입니다.",
  disclaimer: "본 검사는 참고용 자가검사이며, 의료적 진단을 대체하지 않습니다. 결과에 관계없이 우려가 있으시면 전문가와 상담하세요.",
  maxScore: 30,
  questions: [
    // 시간 감각 (Temporal Orientation)
    {
      id: "cog-1",
      domain: "temporal_orientation",
      domainKo: "시간 감각",
      text: "지금 무슨 계절인가요?",
      type: "choice",
      options: [
        { label: "봄", value: "spring", score: 2 },
        { label: "여름", value: "summer", score: 2 },
        { label: "가을", value: "autumn", score: 2 },
        { label: "겨울", value: "winter", score: 2 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-2",
      domain: "temporal_orientation",
      domainKo: "시간 감각",
      text: "오늘 날짜가 며칠인가요?",
      type: "choice",
      options: [
        { label: "1-7일 사이", value: "correct", score: 2 },
        { label: "8-14일 사이", value: "nearby", score: 1 },
        { label: "15-21일 사이", value: "nearby", score: 1 },
        { label: "22-31일 사이", value: "wrong", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-3",
      domain: "temporal_orientation",
      domainKo: "시간 감각",
      text: "지금 몇 시쯤인가요?",
      type: "choice",
      options: [
        { label: "오전 6-9시", value: "morning_early", score: 2 },
        { label: "오전 9-12시", value: "morning_late", score: 2 },
        { label: "오후 12-6시", value: "afternoon", score: 2 },
        { label: "오후 6-12시", value: "evening", score: 2 },
      ],
      maxScore: 2,
    },
    // 장소 감각 (Spatial Orientation)
    {
      id: "cog-4",
      domain: "spatial_orientation",
      domainKo: "장소 감각",
      text: "지금 계신 곳은 어떤 종류의 장소인가요?",
      type: "choice",
      options: [
        { label: "집", value: "home", score: 2 },
        { label: "병원", value: "hospital", score: 2 },
        { label: "사무실", value: "office", score: 2 },
        { label: "야외", value: "outdoor", score: 2 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-5",
      domain: "spatial_orientation",
      domainKo: "장소 감각",
      text: "현재 계신 도시(지역) 이름이 무엇인가요?",
      type: "choice",
      options: [
        { label: "서울", value: "seoul", score: 2 },
        { label: "부산", value: "busan", score: 2 },
        { label: "대구", value: "daegu", score: 2 },
        { label: "기타", value: "other", score: 2 },
      ],
      maxScore: 2,
    },
    // 등록 기억 (Registration)
    {
      id: "cog-6",
      domain: "registration",
      domainKo: "등록 기억",
      text: "다음 세 단어를 기억해주세요: 장미, 의자, 강아지. 첫 번째 단어는?",
      type: "choice",
      options: [
        { label: "장미", value: "rose", score: 2 },
        { label: "의자", value: "chair", score: 0 },
        { label: "강아지", value: "dog", score: 0 },
        { label: "고양이", value: "cat", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-7",
      domain: "registration",
      domainKo: "등록 기억",
      text: "두 번째 단어는?",
      type: "choice",
      options: [
        { label: "장미", value: "rose", score: 0 },
        { label: "의자", value: "chair", score: 2 },
        { label: "강아지", value: "dog", score: 0 },
        { label: "고양이", value: "cat", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-8",
      domain: "registration",
      domainKo: "등록 기억",
      text: "세 번째 단어는?",
      type: "choice",
      options: [
        { label: "장미", value: "rose", score: 0 },
        { label: "의자", value: "chair", score: 0 },
        { label: "강아지", value: "dog", score: 2 },
        { label: "고양이", value: "cat", score: 0 },
      ],
      maxScore: 2,
    },
    // 주의력 (Attention)
    {
      id: "cog-9",
      domain: "attention",
      domainKo: "주의력",
      text: "100에서 7을 빼면 몇인가요?",
      type: "choice",
      options: [
        { label: "93", value: "93", score: 2 },
        { label: "97", value: "97", score: 0 },
        { label: "87", value: "87", score: 0 },
        { label: "103", value: "103", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-10",
      domain: "attention",
      domainKo: "주의력",
      text: "거기서 다시 7을 빼면?",
      type: "choice",
      options: [
        { label: "86", value: "86", score: 2 },
        { label: "90", value: "90", score: 0 },
        { label: "80", value: "80", score: 0 },
        { label: "96", value: "96", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-11",
      domain: "attention",
      domainKo: "주의력",
      text: "다음 수열에서 다음 숫자는? 2, 4, 8, 16, ?",
      type: "choice",
      options: [
        { label: "32", value: "32", score: 2 },
        { label: "24", value: "24", score: 0 },
        { label: "20", value: "20", score: 0 },
        { label: "64", value: "64", score: 0 },
      ],
      maxScore: 2,
    },
    // 회상 (Recall)
    {
      id: "cog-12",
      domain: "recall",
      domainKo: "회상",
      text: "아까 기억한 세 단어 중 첫 번째는?",
      type: "choice",
      options: [
        { label: "장미", value: "rose", score: 2 },
        { label: "의자", value: "chair", score: 0 },
        { label: "강아지", value: "dog", score: 0 },
        { label: "고양이", value: "cat", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-13",
      domain: "recall",
      domainKo: "회상",
      text: "아까 기억한 세 단어 중 세 번째는?",
      type: "choice",
      options: [
        { label: "장미", value: "rose", score: 0 },
        { label: "의자", value: "chair", score: 0 },
        { label: "강아지", value: "dog", score: 2 },
        { label: "고양이", value: "cat", score: 0 },
      ],
      maxScore: 2,
    },
    // 언어 (Language)
    {
      id: "cog-14",
      domain: "language",
      domainKo: "언어",
      text: "다음 두 단어의 공통점은 무엇인가요? '사과'와 '포도'",
      type: "choice",
      options: [
        { label: "과일", value: "fruit", score: 2 },
        { label: "음식", value: "food", score: 0 },
        { label: "빨간색", value: "red", score: 0 },
        { label: "비싸다", value: "expensive", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "cog-15",
      domain: "language",
      domainKo: "언어",
      text: "다음 지시를 따라주세요: '왼손으로 오른쪽 귀를 만지세요'. 어떤 동작인가요?",
      type: "choice",
      options: [
        { label: "왼손으로 오른쪽 귀", value: "left_hand_right_ear", score: 2 },
        { label: "오른손으로 오른쪽 귀", value: "right_hand_right_ear", score: 0 },
        { label: "왼손으로 왼쪽 귀", value: "left_hand_left_ear", score: 0 },
        { label: "오른손으로 왼쪽 귀", value: "right_hand_left_ear", score: 0 },
      ],
      maxScore: 2,
    },
  ],
};

export const mocaTest: ScreeningTest = {
  id: "moca-style",
  title: "MoCA 스타일 검사",
  description: "시공간 기능, 집중력, 기억력, 언어 능력 등을 평가하는 인지 검사입니다.",
  disclaimer: "본 검사는 참고용 자가검사이며, 의료적 진단을 대체하지 않습니다. 결과에 관계없이 우려가 있으시면 전문가와 상담하세요.",
  maxScore: 30,
  questions: [
    // 시공간/실행 (Visuospatial/Executive)
    {
      id: "moca-1",
      domain: "visuospatial_executive",
      domainKo: "시공간/실행",
      text: "다음 패턴에서 다음 모양은? ○ □ ○ □ □ ○ □ ○ □ □ ?",
      type: "choice",
      options: [
        { label: "○", value: "circle", score: 3 },
        { label: "□", value: "square", score: 0 },
        { label: "△", value: "triangle", score: 0 },
        { label: "◇", value: "diamond", score: 0 },
      ],
      maxScore: 3,
    },
    {
      id: "moca-2",
      domain: "visuospatial_executive",
      domainKo: "시공간/실행",
      text: "시계가 11시 10분을 가리킬 때 시침과 분침의 위치로 맞는 것은?",
      type: "choice",
      options: [
        { label: "시침: 11시 조금 넘음, 분침: 2", value: "correct", score: 2 },
        { label: "시침: 11시, 분침: 10", value: "wrong_1", score: 0 },
        { label: "시침: 11시, 분침: 2", value: "wrong_2", score: 0 },
        { label: "시침: 10시, 분침: 2", value: "wrong_3", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "moca-3",
      domain: "visuospatial_executive",
      domainKo: "시공간/실행",
      text: "다음 숫자를 거꾸로 말하면? 5-3-9-1-7",
      type: "choice",
      options: [
        { label: "7-1-9-3-5", value: "correct", score: 2 },
        { label: "5-1-9-3-7", value: "reverse_partial", score: 0 },
        { label: "7-9-1-3-5", value: "wrong_1", score: 0 },
        { label: "5-3-9-1-7", value: "same", score: 0 },
      ],
      maxScore: 2,
    },
    // 이름대기 (Naming)
    {
      id: "moca-4",
      domain: "naming",
      domainKo: "이름대기",
      text: "털이 있고 멍멍 짖는 동물은?",
      type: "choice",
      options: [
        { label: "개", value: "dog", score: 2 },
        { label: "고양이", value: "cat", score: 0 },
        { label: "토끼", value: "rabbit", score: 0 },
        { label: "새", value: "bird", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "moca-5",
      domain: "naming",
      domainKo: "이름대기",
      text: "바다에 사는 큰 동물로 물을 뿜는 것은?",
      type: "choice",
      options: [
        { label: "고래", value: "whale", score: 2 },
        { label: "상어", value: "shark", score: 0 },
        { label: "돌고래", value: "dolphin", score: 0 },
        { label: "문어", value: "octopus", score: 0 },
      ],
      maxScore: 2,
    },
    // 주의력 (Attention)
    {
      id: "moca-6",
      domain: "attention",
      domainKo: "주의력",
      text: "다음 숫자를 그대로 따라 말하세요: 2-1-8-5-4",
      type: "choice",
      options: [
        { label: "2-1-8-5-4", value: "correct", score: 2 },
        { label: "2-8-1-5-4", value: "wrong_1", score: 0 },
        { label: "4-5-8-1-2", value: "reverse", score: 0 },
        { label: "2-1-8-4-5", value: "wrong_2", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "moca-7",
      domain: "attention",
      domainKo: "주의력",
      text: "다음 문자에서 '가'가 나올 때마다 손을 들으세요: 나 가 다 라 가 마 가. 몇 번인가요?",
      type: "choice",
      options: [
        { label: "3번", value: "3", score: 3 },
        { label: "2번", value: "2", score: 0 },
        { label: "4번", value: "4", score: 0 },
        { label: "1번", value: "1", score: 0 },
      ],
      maxScore: 3,
    },
    {
      id: "moca-8",
      domain: "attention",
      domainKo: "주의력",
      text: "1000에서 7을 계속 빼세요. 처음 결과는?",
      type: "choice",
      options: [
        { label: "993", value: "993", score: 2 },
        { label: "997", value: "997", score: 0 },
        { label: "983", value: "983", score: 0 },
        { label: "1007", value: "1007", score: 0 },
      ],
      maxScore: 2,
    },
    // 언어 (Language)
    {
      id: "moca-9",
      domain: "language",
      domainKo: "언어",
      text: "다음 문장을 반복해서 말하세요: '오늘 날씨가 참 좋습니다'",
      type: "choice",
      options: [
        { label: "정확히 일치", value: "exact", score: 2 },
        { label: "비슷함", value: "similar", score: 0 },
        { label: "틀림", value: "wrong", score: 0 },
        { label: "전혀 다름", value: "different", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "moca-10",
      domain: "language",
      domainKo: "언어",
      text: "1분 안에 동물 이름을 가능한 많이 말하세요. 15개 이상 말했나요?",
      type: "choice",
      options: [
        { label: "예", value: "yes", score: 2 },
        { label: "아니오", value: "no", score: 0 },
        { label: "10-14개", value: "10_14", score: 1 },
        { label: "기억 안 남", value: "dont_remember", score: 0 },
      ],
      maxScore: 2,
    },
    // 추상화 (Abstraction)
    {
      id: "moca-11",
      domain: "abstraction",
      domainKo: "추상화",
      text: "'지갑'과 '가방'의 공통점은?",
      type: "choice",
      options: [
        { label: "물건을 넣는 곳", value: "container", score: 2 },
        { label: "가죽으로 만듦", value: "leather", score: 0 },
        { label: "휴대용", value: "portable", score: 0 },
        { label: "비싼 것", value: "expensive", score: 0 },
      ],
      maxScore: 2,
    },
    // 지연 회상 (Delayed Recall)
    {
      id: "moca-12",
      domain: "delayed_recall",
      domainKo: "지연 회상",
      text: "아까 기억한 다섯 단어를 말해주세요: 사과, 의자, 강아지, 바다, 음악. 몇 개를 기억했나요?",
      type: "choice",
      options: [
        { label: "5개", value: "5", score: 5 },
        { label: "4개", value: "4", score: 4 },
        { label: "3개", value: "3", score: 3 },
        { label: "2개 이하", value: "0_2", score: 0 },
      ],
      maxScore: 5,
    },
  ],
};
