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
  comments?: IComment[];
}
export interface IComment {
  user: string;
  text: string;
  createdAt: Date;
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
