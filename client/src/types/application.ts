export type Status =
  | "backlog"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected";

/* This code snippet is defining an interface named `Application` in TypeScript. An interface in
TypeScript is a way to define the structure of an object. */
export interface Application {
  _id: string;
  user: string;
  jobTitle: string;
  companyName: string;
  status: Status;
  position: number;
  cvVersion?: string;
  coverLetterVersion?: string;
  jobUrl?: string;
  jobDescription?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  tags?: string[];
  appliedAt?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}