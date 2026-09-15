export interface FeedbackOption {
  id: number;
  group_id: number | null;
  codename: string;
  label: string;
  group: string;
  sort_order: number;
  color: string | null;
}

export interface FeedbackCreate {
  codename: string;
  intensity?: number | null;
  comment?: string | null;
  extra?: Record<string, unknown> | null;
}

export interface FeedbackRecord {
  id: number;
  user_id: number;
  feedback_type_id: number;
  intensity: number | null;
  comment: string | null;
  extra: Record<string, unknown> | null;
  created_at: string;
}

export const DEFAULT_FEEDBACK_OPTIONS: FeedbackOption[] = [
  {
    id: 0,
    group_id: null,
    codename: 'everything_ok',
    label: 'Everything Ok!',
    group: 'generic',
    sort_order: 10,
    color: 'success',
  },
  {
    id: 0,
    group_id: null,
    codename: 'too_cold',
    label: 'Too cold',
    group: 'temperature',
    sort_order: 20,
    color: 'blue',
  },
  {
    id: 0,
    group_id: null,
    codename: 'too_warm',
    label: 'Too warm',
    group: 'temperature',
    sort_order: 30,
    color: 'red',
  },
  {
    id: 0,
    group_id: null,
    codename: 'too_humid',
    label: 'Too humid',
    group: 'humidity',
    sort_order: 40,
    color: 'blue',
  },
  {
    id: 0,
    group_id: null,
    codename: 'too_dry',
    label: 'Too dry',
    group: 'humidity',
    sort_order: 50,
    color: 'red',
  },
  {
    id: 0,
    group_id: null,
    codename: 'poor_air_quality',
    label: 'Poor Air Quality',
    group: 'air_quality',
    sort_order: 60,
    color: 'gray',
  },
  {
    id: 0,
    group_id: null,
    codename: 'noise',
    label: 'Noise!',
    group: 'noise',
    sort_order: 70,
    color: 'yellow',
  },
];
