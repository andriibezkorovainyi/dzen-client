export function openBase64FileInNewTab(base64Data: string) {
    const base64Content = base64Data.split(',')[1];
    const decodedText = atob(base64Content);

    const newTab = window.open();
    newTab?.document.write(`<pre>${decodedText}</pre>`);
    newTab?.document.close();
}
