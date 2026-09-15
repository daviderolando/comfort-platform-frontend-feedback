export interface AdminBuilding {
  id: number;
  name: string;
  metadata_json: Record<string, unknown> | null;
}

export interface AdminFeedback {
  id: number;
  created_at: string | null;
  username: string;
  user_id: number;
  building_id: number | null;
  building_name: string | null;
  room_id: number | null;
  room_label: string | null;
  feedback_type_id: number;
  feedback_label: string;
  feedback_codename: string;
  feedback_group: string;
  intensity: number | null;
  comment: string | null;
  extra: Record<string, unknown> | null;
}
