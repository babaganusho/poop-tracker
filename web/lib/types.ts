export type Profile = {
  id: string;
  username: string;
  age: number | null;
  weight_kg: number | null;
  avg_sitting_minutes: number | null;
  avatar_url: string | null;
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
  avatar_url: string | null;
  entries_count: number;
  avg_weight_grams: number | null;
  max_weight_grams: number | null;
  min_weight_grams: number | null;
  last_entry_date: string | null;
};
