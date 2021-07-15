export class FeedsDTO {
    id: string;
    userId!: string;
    files: string[];
    contents: string;
    location: string;
    isHide: boolean;
  }