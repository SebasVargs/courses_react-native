export interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    type: 'lessons' | 'courses' | 'daily'; 
    deadline?: Date;
  }