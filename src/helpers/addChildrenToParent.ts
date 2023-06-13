import {CommentServerPayload} from "../types";


export const addChildrenToParent = (parentId: number, children: CommentServerPayload[], array: CommentServerPayload[]): CommentServerPayload[] => {
    return array.map((comment) => {
        if (!comment.children) {
            comment.children = [];
        }

        if (comment.id === parentId) {
            return {
                ...comment,
                childrenCount: children.length,
                children: [...children],
            };
        } else if (comment.children && comment.children.length > 0) {
            return {
                ...comment,
                children: addChildrenToParent(parentId, children, [...comment.children]),
            };
        }
        return comment;
    });
}
