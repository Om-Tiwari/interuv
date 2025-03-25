export interface Message {
  id: string;
  text: string;
  sender: "Candidate" | "Interviewer";
  timestamp?: string;
  isHtml?: boolean;
}

export interface QuestionData {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  questionText?: string;
  inputDescription?: string;
  outputDescription?: string;
  constraints?: string[];
  sampleInputOutput?: string[] | string;
  explanation?: string;
  programmingLang?: string;
  templateCode?: string;
  testCases?: string;
  evaluationFunction?: string;
} 