export interface Question {
  id: number;
  text: string;
}

export type Answer = 0 | 1 | 2 | 3;

export interface Option {
  value: Answer;
  label: string;
}

export const options: Option[] = [
  { value: 0, label: "Lebih baik dari biasanya" },
  { value: 1, label: "Sama seperti biasanya" },
  { value: 2, label: "Kurang dari biasanya" },
  { value: 3, label: "Sangat kurang dari biasanya" }
];
