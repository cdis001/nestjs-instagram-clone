export class FeedsDTO {
    id: string;
    userId!: string;
    commentsId: string;
    likesId: string;
    files!: string[];
    contents: string;
    location: string;
    isHide: boolean;
  }