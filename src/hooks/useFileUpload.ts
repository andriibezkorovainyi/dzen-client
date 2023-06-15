import {useState} from "react";
import Resizer from "react-image-file-resizer";

export const useFileUpload = () => {
    const [fileError, setFileError] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [fileType, setFileType] = useState('');

    const resetFileData = () => {
        setFileName('');
        setFileSize(0);
        setFileError(false);
    };

    const resizeFile = (file: File, format: 'JPEG' | 'PNG' | 'GIF' | 'JPG') =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                320,
                320,
                format,
                100,
                0,
                (url) => {
                    resolve(url);
                },
                "base64",
                240,
                240
            );
        });

    const handleImageResize = async (file: File) => {
        try {
            const format = file?.type.split('/')[1].toUpperCase() as 'JPG' | 'JPEG' | 'PNG' | 'GIF';

            if (!file) return;

            const image = await resizeFile(file, format) as string;

            return image;
        } catch (err) {
            console.log(err);
        }
    }

    const validateFile = async (file: File): Promise<string | undefined> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onloadend = () => {
                const fileContent = fileReader.result as string;

                if (fileContent.includes('data:image/')) {
                    handleImageResize(file).then((resizedUrl) => {
                        resolve(resizedUrl);
                    }).catch((error) => {
                        reject(undefined);
                        console.log(error);
                    });
                } else if (fileContent.includes('data:text/plain')) {
                    if (
                        file.size > 102400 ||
                        file.name.split('.')[1].toLowerCase() !== 'txt'
                    ) {
                        setFileError(true);
                        reject(undefined);
                    } else {
                        resolve(fileContent);
                    }
                } else {
                    setFileError(true);
                    reject(undefined);
                }
            };

            fileReader.readAsDataURL(file);
            setFileName(file.name);
            setFileSize(file.size);
            setFileType(file.type);
        });
    };

    return {
        fileType,
        fileError,
        fileName,
        fileSize,
        resetFileData,
        validateFile,
    }
};
