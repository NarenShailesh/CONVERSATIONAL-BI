export interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  chartHtml?: string;
}

export interface ChatSession {
  id: string;
  startTime: string;
  messages: Message[];
  tableName: string;
}

// FIX: Add ColumnStats interface for better type safety of summary statistics.
export interface ColumnStats {
  Count: number;
  Mean: string;
  Median: string;
  Min: string;
  Max: string;
}
