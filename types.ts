export interface CMSImage {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  sizes: {
    thumbnail: {
      url: null;
      width: null;
      height: null;
      mimeType: null;
      filesize: null;
      filename: null;
    };
    card: {
      url: null;
      width: null;
      height: null;
      mimeType: null;
      filesize: null;
      filename: null;
    };
    tablet: {
      url: null;
      width: null;
      height: null;
      mimeType: null;
      filesize: null;
      filename: null;
    };
  };
  createdAt: string;
  updatedAt: string;
  url: string;
}
export interface Tag {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}
export interface Project {
  id: string;
  title: string;
  date: string;
  teaserImage?: CMSImage;
  tags?: Tag[];
  content: any;
  priority: number;
  videos: {
    vimeoUrl: string;
    caption?: string;
  }[];
  images: {
    image: CMSImage;
    caption: string;
    id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
export interface Press {
  id: string;
  title: string;
  date: string;
  thumbnail?: CMSImage;
  pdfDocument?: {
    id: string;
    filename: string;
    url: string;
  };
  priority: number;
  createdAt: string;
  updatedAt: string;
}
export interface Global {
  createdAt: string;
  updatedAt: string;
  portfolio: {
    activeTags?: Tag[];
    defaultTag?: Tag;
  };
  introGallery?: {
    image: CMSImage;
  }[];
}
export interface CVItem {
  title: string;
  content: any;
}
