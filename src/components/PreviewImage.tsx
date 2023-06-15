import '../styles/PreviewImage.css'
import {FC, useState} from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const PreviewImage: FC<{ file: string }> = ({file}) => {
    const [showPreview, setShowPreview] = useState(false);


    return <>
        <button
            className="preview-image-button"
            onClick={() => setShowPreview(true)}
        >
            <Lightbox
                open={showPreview}
                close={() => setShowPreview(false)}
                slides={[{src: file}]}
            />
            <img src={file} alt="preview" className="preview-image"/>
        </button>
    </>
}
