export type CountryId = 'bangladesh' | 'india' | 'argentina' | 'brazil' | 'spain';

export interface Country {
  id:          CountryId;
  name:        string;
  nameBn:      string;
  flag:        string;
  leagues:     string[];
  keywords:    string[];
  description: string;
}
