export interface User {
    id: string;
    name: string;
    score: number;
  }
  
  export interface Quiz {
    youtubeUrl: string;
    playStart: number;
    playEnd: number;
    answerStart: number;
    answerEnd: number;
    answer: string;
  }
  