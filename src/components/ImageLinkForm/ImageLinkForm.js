import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = () => {
    return (
        <div>
            <p className="f3">
                {"Detect faces in any image. Insert image and press detect."}
            </p>
            <div className="center">
                <div className="center pa4 br3 shadow5 form">
                    <input className="f3 pa2 w-70 br2 mr1" type="text" />
                    <button className="f3 ph3 pv2 w-30 grow link dib white bg-light-purple br2">
                        Detect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageLinkForm;