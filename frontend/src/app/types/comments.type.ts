export type CommentsType =  {
  allCount: number;
  comments: {
    id: string;
    text: string;
    date: string; // можно использовать Date, если преобразовывать строку в объект Date
    likesCount: number;
    dislikesCount: number;
    user: {
      id: string;
      name: string;
    };
  }[];
}
