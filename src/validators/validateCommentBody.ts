interface BodyErrors {
    tooLong?: string;
    empty?: string;
    invalidTag?: string;
    closeTag?: string;
}

export function validateCommentBody(commentText: string) {
    const errors: BodyErrors = {};

    if (commentText.length > 1000) {
        errors.tooLong = 'Максимальная длина комментария 1000 символов';
    }

    if (commentText.trim().length === 0) {
        errors.empty = 'Комментарий не может быть пустым';
    }

    const openingTags = commentText.match(/<[^/][^>]*(?:\s[^>]+)?>/g) || [];
    const closingTags = commentText.match(/<\/[^>]+>/g) || [] as string[];

    const stack: string[] = [];

    for (const tag of openingTags) {
        const tagName = tag.match(/<(.*?)>/)?.[1];

        if (tagName?.includes('a')) {
            const href = tag.match(/href="([^"]+)"/)?.[1];

            if (!href) {
                errors.invalidTag = 'Некорректный HTML тег';
                break;
            }
        }

        if (tagName) {
            stack.push(tagName);
        }
    }

    if (errors.invalidTag) {
        return Object.values(errors);
    }

    for (const closingTag of closingTags) {
        const tagName = closingTag.match(/<\/(.*?)>/)?.[1] || '';

        const lastOpeningTag = stack.pop();

        if (!lastOpeningTag) {
            errors.closeTag = 'Лишний закрывающий тег';
            break;
        }

        const lastOpeningTagRegex = new RegExp(`<${lastOpeningTag}(?:\\s[^>]+)?>`);

        if (lastOpeningTagRegex.test(tagName)) {
            errors.closeTag = 'Некорректный HTML тег или порядок тегов';
            break;
        }
    }

    if (stack.length > 0) {
        errors.closeTag = 'Лишний открывающий тег';
    }

    const disallowedTags = commentText.match(/<(?!\/?(a|i|code|strong)\b)[^>]+>/g);

    if (disallowedTags) {
        errors.invalidTag = 'Некорректный HTML тег';
    }

    return Object.keys(errors).length === 0 ? null : Object.values(errors);
}
