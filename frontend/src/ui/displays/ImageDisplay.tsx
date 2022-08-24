import React from "react";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

export default class ImageDisplay extends React.Component<{ data: Blob }, any> {

    /**
     * Renders the element.
     *
     * @returns The rendered element.
     */
    render(): JSX.Element {
        return <TransformWrapper>
            <TransformComponent>
                <div
                    className={"full"}
                    style={{
                        backgroundImage: `url(${URL.createObjectURL(this.props.data)})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                    // onLoad={(event) => {
                    //     const iframeDoc = event.currentTarget.contentDocument;
                    //     iframeDoc.documentElement.style.left = "0";
                    //     iframeDoc.documentElement.style.top = "0";
                    //     iframeDoc.documentElement.style.position = "absolute";
                    //     iframeDoc.documentElement.style.width = "100%";
                    //     iframeDoc.documentElement.style.height = "100%";
                    // }}
                />
            </TransformComponent>
        </TransformWrapper>;
    }

}
