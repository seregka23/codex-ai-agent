export type DatasetType =
  | 'chat_finetuning'
  | 'classification'
  | 'extraction'
  | 'rag_eval'
  | 'preference';

export type DatasetExampleStatus = 'draft' | 'needs_review' | 'approved' | 'rejected' | 'exported';

export interface Dataset {
  id: string;
  name: string;
  type: DatasetType;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetExample {
  id: string;
  datasetId: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  status: DatasetExampleStatus;
  createdAt: string;
  updatedAt: string;
}
