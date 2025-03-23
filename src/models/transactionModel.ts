export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  date: string;
  category_id?: number | null;
  type: string;
  notes?: string;
  recurrence: "monthly" | "annually" | "none";
}
