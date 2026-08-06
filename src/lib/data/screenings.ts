export type ScreeningQuestion = {
  id: string;
  domain: string;
  domainKo: string;
  text: string;
  type: "choice" | "input" | "wordlist" | "recognition";
  options?: { label: string; value: string; score: number; image?: string }[];
  /** 단어 학습(wordlist) / 지연 재인(recognition) 과제용 */
  words?: string[];
  /** 재인 검사에 섞어 제시하는 혼란 보기(오답 단어) */
  foils?: string[];
  /** 학습 시행 횟수 (wordlist) */
  trials?: number;
  maxScore: number;
  /**
   * 음성으로만 제시하는 자극(숫자·문자열).
   * 화면에는 표시하지 않고 1초 간격으로 또박또박 읽어 줍니다.
   * (음성을 켜지 않았거나 지원되지 않는 기기에서는 화면에 표시됩니다.)
   */
  audioSequence?: string[];
  /** 그림 이름대기 문항에 제시하는 흑백 스케치 이미지 경로 */
  image?: string;
  imageAlt?: string;
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
  title: "간이인지검사",
  description: "기억력, 주의력, 언어 등 주요 인지 기능을 간단히 확인하는 검사입니다.",
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
        { label: "8-14일 사이", value: "d8_14", score: 1 },
        { label: "15-21일 사이", value: "d15_21", score: 1 },
        { label: "1-7일 사이", value: "d1_7", score: 2 },
        { label: "22-31일 사이", value: "d22_31", score: 0 },
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
        { label: "강아지", value: "dog", score: 0 },
        { label: "고양이", value: "cat", score: 0 },
        { label: "장미", value: "rose", score: 2 },
        { label: "의자", value: "chair", score: 0 },
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
        { label: "고양이", value: "cat", score: 0 },
        { label: "장미", value: "rose", score: 0 },
        { label: "강아지", value: "dog", score: 0 },
        { label: "의자", value: "chair", score: 2 },
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
        { label: "의자", value: "chair", score: 0 },
        { label: "강아지", value: "dog", score: 2 },
        { label: "고양이", value: "cat", score: 0 },
        { label: "장미", value: "rose", score: 0 },
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
        { label: "97", value: "97", score: 0 },
        { label: "87", value: "87", score: 0 },
        { label: "93", value: "93", score: 2 },
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
        { label: "90", value: "90", score: 0 },
        { label: "80", value: "80", score: 0 },
        { label: "96", value: "96", score: 0 },
        { label: "86", value: "86", score: 2 },
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
        { label: "24", value: "24", score: 0 },
        { label: "32", value: "32", score: 2 },
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
        { label: "의자", value: "chair", score: 0 },
        { label: "고양이", value: "cat", score: 0 },
        { label: "강아지", value: "dog", score: 0 },
        { label: "장미", value: "rose", score: 2 },
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
        { label: "고양이", value: "cat", score: 0 },
        { label: "강아지", value: "dog", score: 2 },
        { label: "장미", value: "rose", score: 0 },
        { label: "의자", value: "chair", score: 0 },
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
        { label: "음식", value: "food", score: 0 },
        { label: "빨간색", value: "red", score: 0 },
        { label: "비싸다", value: "expensive", score: 0 },
        { label: "과일", value: "fruit", score: 2 },
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
        { label: "오른손으로 오른쪽 귀", value: "right_hand_right_ear", score: 0 },
        { label: "왼손으로 왼쪽 귀", value: "left_hand_left_ear", score: 0 },
        { label: "왼손으로 오른쪽 귀", value: "left_hand_right_ear", score: 2 },
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
        { label: "□", value: "square", score: 0 },
        { label: "△", value: "triangle", score: 0 },
        { label: "○", value: "circle", score: 3 },
        { label: "◇", value: "diamond", score: 0 },
      ],
      maxScore: 3,
    },
    {
      id: "moca-2",
      domain: "visuospatial_executive",
      domainKo: "시공간/실행",
      text: "11시 10분을 바르게 가리키는 시계를 고르세요.",
      type: "choice",
      options: [
        { label: "1번 시계", value: "c_1010", score: 0, image: "/images/screening/clock-1010.svg" },
        { label: "2번 시계", value: "c_1110", score: 2, image: "/images/screening/clock-1110.svg" },
        { label: "3번 시계", value: "c_0255", score: 0, image: "/images/screening/clock-0255.svg" },
        { label: "4번 시계", value: "c_1150", score: 0, image: "/images/screening/clock-1150.svg" },
      ],
      maxScore: 2,
    },
    {
      id: "moca-learn",
      domain: "delayed_recall",
      domainKo: "지연 회상",
      text: "단어 5개를 들려드립니다. 잘 기억해 두세요. 검사 마지막에 다시 여쭤봅니다.",
      type: "wordlist",
      words: ["사과", "의자", "강아지", "바다", "음악"],
      foils: ["포도", "책상", "고양이", "산", "그림"],
      trials: 3,
      maxScore: 0,
    },
    {
      id: "moca-recall-now",
      domain: "immediate_recall",
      domainKo: "즉각 회상",
      text: "방금 들은 다섯 단어가 모두 들어 있는 것을 고르세요.",
      type: "choice",
      options: [
        { label: "사과 · 의자 · 고양이 · 바다 · 그림", value: "set_a", score: 0 },
        { label: "포도 · 의자 · 강아지 · 산 · 음악", value: "set_b", score: 0 },
        { label: "사과 · 의자 · 강아지 · 바다 · 음악", value: "set_correct", score: 1 },
        { label: "사과 · 책상 · 강아지 · 바다 · 음악", value: "set_c", score: 0 },
      ],
      maxScore: 1,
    },
    {
      id: "moca-3",
      domain: "visuospatial_executive",
      domainKo: "시공간/실행",
      text: "들려드리는 숫자를 거꾸로 말하면 무엇인가요?",
      audioSequence: ["5", "3", "9", "1", "7"],
      type: "choice",
      options: [
        { label: "5-1-9-3-7", value: "reverse_partial", score: 0 },
        { label: "7-1-9-3-5", value: "correct", score: 2 },
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
      text: "이 동물의 이름은 무엇인가요?",
      image: "/images/screening/animal-elephant.png",
      imageAlt: "코, 큰 귀, 네 다리가 보이는 동물 스케치",
      type: "choice",
      options: [
        { label: "코뿔소", value: "rhino", score: 0 },
        { label: "코끼리", value: "elephant", score: 2 },
        { label: "하마", value: "hippo", score: 0 },
        { label: "기린", value: "giraffe", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "moca-5",
      domain: "naming",
      domainKo: "이름대기",
      text: "이 동물의 이름은 무엇인가요?",
      image: "/images/screening/animal-whale.png",
      imageAlt: "물을 뿜고 꼬리지느러미가 있는 바다 동물 스케치",
      type: "choice",
      options: [
        { label: "상어", value: "shark", score: 0 },
        { label: "문어", value: "octopus", score: 0 },
        { label: "고래", value: "whale", score: 2 },
        { label: "거북이", value: "turtle", score: 0 },
      ],
      maxScore: 2,
    },
    // 주의력 (Attention)
    {
      id: "moca-6",
      domain: "attention",
      domainKo: "주의력",
      text: "들려드리는 숫자를 다음에서 고르세요.",
      audioSequence: ["2", "1", "8", "5", "4"],
      type: "choice",
      options: [
        { label: "2-8-1-5-4", value: "wrong_1", score: 0 },
        { label: "4-5-8-1-2", value: "reverse", score: 0 },
        { label: "2-1-8-5-4", value: "correct", score: 2 },
        { label: "2-1-8-4-5", value: "wrong_2", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "moca-7",
      domain: "attention",
      domainKo: "주의력",
      text: "글자를 하나씩 읽어 드립니다. '가'가 나올 때마다 손을 드세요. 모두 몇 번이었나요?",
      audioSequence: ["나", "가", "다", "라", "가", "마", "가"],
      type: "choice",
      options: [
        { label: "2번", value: "2", score: 0 },
        { label: "4번", value: "4", score: 0 },
        { label: "1번", value: "1", score: 0 },
        { label: "3번", value: "3", score: 3 },
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
        { label: "997", value: "997", score: 0 },
        { label: "993", value: "993", score: 2 },
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
      text: "다음 말하는 내용을 바로 쓴 글은?",
      audioSequence: ["오늘 날씨가 참 좋습니다."],
      type: "choice",
      options: [
        { label: "오늘은 날씨가 참 좋습니다.", value: "s_eun", score: 0 },
        { label: "오늘 날씨가 참 좋습니다.", value: "s_correct", score: 2 },
        { label: "오늘 날씨가 참 좋았습니다.", value: "s_past", score: 0 },
        { label: "오늘 날씨는 참 좋습니다.", value: "s_neun", score: 0 },
      ],
      maxScore: 2,
    },
    {
      id: "moca-10",
      domain: "language",
      domainKo: "언어",
      text: "1분 안에 동물 이름을 가능한 많이 말해 보세요. 몇 개를 말했나요?",
      type: "choice",
      options: [
        { label: "10개 이하", value: "n0_10", score: 0 },
        { label: "11-14개", value: "n11_14", score: 1 },
        { label: "15개 이상", value: "n15", score: 2 },
        { label: "세어 보지 못함", value: "unknown", score: 0 },
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
        { label: "가죽으로 만듦", value: "leather", score: 0 },
        { label: "휴대용", value: "portable", score: 0 },
        { label: "비싼 것", value: "expensive", score: 0 },
        { label: "물건을 넣는 곳", value: "container", score: 2 },
      ],
      maxScore: 2,
    },
    // 지연 회상 (Delayed Recall)
    {
      id: "moca-12",
      domain: "delayed_recall",
      domainKo: "지연 회상",
      text: "앞에서 들려드린 단어인지 답해 주세요.",
      type: "recognition",
      words: ["사과", "의자", "강아지", "바다", "음악"],
      foils: ["포도", "책상", "고양이", "산", "그림"],
      maxScore: 5,
    },
  ],
};
