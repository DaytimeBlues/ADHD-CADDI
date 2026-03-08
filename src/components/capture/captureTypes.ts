export type BubbleState =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'needs-review'
  | 'failed'
  | 'offline'
  | 'needs-checkin';
