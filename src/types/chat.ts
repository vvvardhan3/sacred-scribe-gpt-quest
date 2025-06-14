
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  input: string;
  loading: boolean;
  expandedCitations: { [key: string]: boolean };
  titleGenerated: boolean;
}
