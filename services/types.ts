/** 文件夹 or 图片 */
type FileType = "dir" | "image";

export type FileMeta = {
  name: string;
  /** 文件类型 */
  type?: FileType;
  /** 文件大小 */
  size?: number;
  /** 最后修改时间 */
  lastModified?: string;
  /** 与后端url相拼接即可得到具体图片url */
  objectKey?: string;
};

export interface GetFolderContentResp {
  fileList: FileMeta[];
}

export interface GetBucketResp {
  bucketList: string[];
}

export interface GetFileListReq {
  bucket: string;
  location: string;
}
