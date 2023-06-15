export const dataUrlToFile = async (dataUrl: string, filename: string, mimeType: string) => {
    const response = await fetch(dataUrl)
    const buf = await response.arrayBuffer()
    return new File([buf], filename, {type: mimeType})
}
