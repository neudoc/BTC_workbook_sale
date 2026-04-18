export type CartItem = {
  slug: string;
  title: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  buyerName: string;
};

export type TrainingRecord = {
  id: string;
  createdAt: string;
  game: string;
  scoreLabel: string;
};

export type ScreeningRecord = {
  id: string;
  createdAt: string;
  test: string;
  summary: string;
  note: string;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const CART_KEY = "btc_cart_v1";
const ORDER_KEY = "btc_orders_v1";
const TRAINING_KEY = "btc_training_v1";
const SCREENING_KEY = "btc_screening_v1";
const INQUIRY_KEY = "btc_inquiries_v1";

export const cartStorage = {
  getItems(): CartItem[] {
    if (typeof window === "undefined") return [];
    return safeParse<CartItem[]>(localStorage.getItem(CART_KEY), []);
  },
  setItems(items: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },
  getCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
  addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    const items = this.getItems();
    const existing = items.find((i) => i.slug === item.slug);
    if (existing) existing.quantity += quantity;
    else items.push({ ...item, quantity });
    this.setItems(items);
  },
  updateQuantity(slug: string, quantity: number) {
    const items = this.getItems()
      .map((i) => (i.slug === slug ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    this.setItems(items);
  },
  clear() {
    this.setItems([]);
  }
};

export const orderStorage = {
  getAll(): Order[] {
    if (typeof window === "undefined") return [];
    return safeParse<Order[]>(localStorage.getItem(ORDER_KEY), []);
  },
  add(order: Order) {
    const all = this.getAll();
    all.unshift(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(all));
  }
};

export const trainingStorage = {
  getAll(): TrainingRecord[] {
    if (typeof window === "undefined") return [];
    return safeParse<TrainingRecord[]>(localStorage.getItem(TRAINING_KEY), []);
  },
  add(record: TrainingRecord) {
    const all = this.getAll();
    all.unshift(record);
    localStorage.setItem(TRAINING_KEY, JSON.stringify(all));
  }
};

export const screeningStorage = {
  getAll(): ScreeningRecord[] {
    if (typeof window === "undefined") return [];
    return safeParse<ScreeningRecord[]>(localStorage.getItem(SCREENING_KEY), []);
  },
  add(record: ScreeningRecord) {
    const all = this.getAll();
    all.unshift(record);
    localStorage.setItem(SCREENING_KEY, JSON.stringify(all));
  }
};

export type Inquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  message: string;
};

export const inquiryStorage = {
  getAll(): Inquiry[] {
    if (typeof window === "undefined") return [];
    return safeParse<Inquiry[]>(localStorage.getItem(INQUIRY_KEY), []);
  },
  add(inquiry: Inquiry) {
    const all = this.getAll();
    all.unshift(inquiry);
    localStorage.setItem(INQUIRY_KEY, JSON.stringify(all));
  }
};

export type Enrollment = {
  id: string;
  createdAt: string;
  courseId: string;
  courseTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  total: number;
  status: "confirmed" | "pending";
};

const ENROLLMENT_KEY = "btc_enrollments_v1";

export const enrollmentStorage = {
  getAll(): Enrollment[] {
    if (typeof window === "undefined") return [];
    return safeParse<Enrollment[]>(localStorage.getItem(ENROLLMENT_KEY), []);
  },
  add(enrollment: Enrollment) {
    const all = this.getAll();
    all.unshift(enrollment);
    localStorage.setItem(ENROLLMENT_KEY, JSON.stringify(all));
  }
};

