export type Profile = {
  id: string;
  username: string;
  created_at: string;
};

export type Entry = {
  id: string;
  user_id: string;
  entry_date: string;
  weight_grams: number;
  note: string | null;
  created_at: string;
};

export type UserStats = {
  username: string;
  entries_count: number;
  avg_weight_grams: number | null;
  max_weight_grams: number | null;
  min_weight_grams: number | null;
  last_entry_date: string | null;
};
