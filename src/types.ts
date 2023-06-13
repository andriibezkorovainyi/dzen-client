export interface CommentServerPayload {
    id: number;
    body: string;
    userId: number;
    parentId: number | null;
    userName: string;
    email: string;
    avatarUrl: string;
    file: FileServerPayload | null;
    children: CommentServerPayload[];
    childrenCount: number | null;
    createdAt: string;
}

export interface FileServerPayload {
    id: number;
    name: string;
    type: string;
    commentId: number;
    size: number;
    url: string;
}

export interface UserI {
    id: number;
    userName: string;
    email: string;
    avatarUrl: string;
    homePage?: string;
    password: string;
    createdAt: string;
}

export interface Message {
    event: string;
    data: CreateCommentClientPayload | CommentsSearchParams | GetUser;
}

export interface CreateCommentClientPayload {
    body: string;
    userId: number;
    parentId: number | null;
    avatarUrl: string;
    userName: string;
    email: string;
    file: CreateFileClientPayload | null;
}

export interface GetUser {
    userName?: string;
    email: string;
    password: string;
    homePage?: string;
}

export interface CommentsSearchParams {
    page?: number;
    sortBy?: string;
    orderBy?: string;
    parentId?: number | null;
}

export interface ServerPayload {
    event: string;
    data: AnswersData | UserI | CommentServerPayload | CommentServerPayload[] | string[] | number;
}

export interface AnswersData {
    parentId: number;
    children?: CommentServerPayload[];
    newComment?: CommentServerPayload;
}

export interface CreateFileClientPayload {
    fileName: string;
    dataUrl: string;
}

export interface FilePreview {
    fileName: string;
    dataUrl: string | undefined;
    fileSize: number;
}

export interface CommentPreview {
    body: string;
    user?: UserI;
    file: FilePreview | null;
}
