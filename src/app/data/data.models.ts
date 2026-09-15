export interface FeedbackSummaryItem {
  codename: string;
  label: string;
  group: string;
  color: string | null;
  count: number;
}

export interface FeedbackSummary {
  scope: 'me' | 'building' | 'admin';
  days: number;
  items: FeedbackSummaryItem[];
}

export interface DataBuilding {
  id: number;
  name: string;
  metadata_json: Record<string, unknown> | null;
}

export interface PeriodOption {
  label: string;
  days: number;
}
