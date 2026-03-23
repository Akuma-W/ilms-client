export interface School {
  id: string;
  name: string;
  shortname: string | null;
  address: string | null;
  city: string;
  createdAt: Date;
}
