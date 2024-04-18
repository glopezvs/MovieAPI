export interface IMovie {
  id: string;
  title: string;
  year: number;
  description?: string;
  genre: string[];
  trailer: string;
  image: string;
  rating?: {
    imdb?: number;
    rottenTomatoes?: number;
  };
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
