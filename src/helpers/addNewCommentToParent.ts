import {CommentServerPayload} from "../types";

export const addNewCommentToParent = (parentId: number, newComment: CommentServerPayload, array: CommentServerPayload[]): CommentServerPayload[] => {
    return array.map((comment) => {
        if (!comment.children) {
            comment.children = [];
        }

        if (comment.id === parentId) {
            return {
                ...comment,
                childrenCount: comment.childrenCount ? comment.childrenCount + 1 : 1,
                children: [...comment.children, newComment],
            };
        } else if (comment.children.length > 0) {
            return {
                ...comment,
                children: addNewCommentToParent(parentId, newComment, [...comment.children]),
            };
        }

        return comment;
    });
};
