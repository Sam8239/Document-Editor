import { Node, mergeAttributes } from "@tiptap/core";
import { ImageIcon } from "../assets/icons";
import { generateRandomId } from "../utils";

// Placeholder node for uploading images
export default Node.create({
    name: "image-placeholder",

    inline() {
        return false;
    },

    group() {
        return "block";
    },

    addOptions() {
        return {
            ...this.parent?.(),
            uploadCallback: () => Promise.resolve({ name: "", url: "" }),
        };
    },

    addAttributes() {
        return {
            id: {
                default: null,
            },
            width: {
                default: "100%", // Default width attribute
            },
            height: { default: "249px" }, // Default height attribute
        };
    },

    parseHTML() {
        return [
            {
                tag: "div[data-image-placeholder]",
                getAttrs: (dom) => ({
                    width: dom.style.width || "100%",
                    height: dom.style.height || "249px",
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, {
                "data-image-placeholder": "",
                style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height}`,
            }),
            "Click to upload an image",
        ];
    },

    addNodeView() {
        const that = this;
        const {
            options: { uploadCallback },
        } = that;

        return ({ node, getPos, editor }) => {
            const dom = document.createElement("div");
            const svgImageIcon = document.createElement("svg");
            const pathId = generateRandomId(12);

            dom.classList.add("image-placeholder");
            svgImageIcon.innerHTML = ImageIcon(pathId);
            dom.append(svgImageIcon);
            dom.setAttribute("data-image-placeholder", "");
            dom.style.width = node.attrs.width; // Set initial width
            dom.style.height = node.attrs.height; // Set initial height

            dom.title = "Click to upload an image";
            Object.assign(dom.style, {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#F8F4F1",
                color: "#A09892",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
                borderRadius: "4px",
                userSelect: "none",
                position: "relative",
            });

            const handleClick = () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.hidden = true;
                input.setAttribute("style", "visibility:hidden;");
                input.addEventListener("change", async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const uploadResult = await uploadCallback(file);

                        if (uploadResult) {
                            const { name, url } = uploadResult;

                            if (!url) return;

                            const { from, to } = editor.view.state.selection;

                            if (from !== null && to !== null) {
                                const width =
                                    window.getComputedStyle(dom).width;
                                const style = `width: ${width};`;

                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(from, to)
                                    .insertContent({
                                        type: "image",
                                        attrs: {
                                            src: url,
                                            title: name,
                                            style,
                                        },
                                    })
                                    .run();
                            }
                        }
                    }
                });
                input.click();
            };

            // Draggable handle for resizing
            const resizeHandle = document.createElement("div");
            resizeHandle.classList.add("image-placeholder__resize-handle");
            Object.assign(resizeHandle.style, {
                width: "7px",
                height: "60px",
                background: "#A09892",
                cursor: "ew-resize",
                position: "absolute",
                right: "-3px",
                marginLeft: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: "120px",
            });

            resizeHandle.addEventListener("mousedown", (e) => {
                e.preventDefault();

                const startX = e.pageX;
                const startWidth = parseInt(
                    window.getComputedStyle(dom).width,
                    10
                );
                const editorWidth = editor.view.dom.clientWidth; // Get editor width
                const minWidth = 60;

                const doDrag = (e) => {
                    const aspectRatio = 16 / 9; // Aspect ratio 16:9
                    const newWidth = startWidth + e.pageX - startX;
                    const newHeight = newWidth / aspectRatio; // Calculate height based on aspect ratio

                    if (newWidth < minWidth || newWidth > editorWidth) return;
                    dom.style.width = newWidth + "px";
                    dom.style.height = newHeight + "px";
                };

                const stopDrag = () => {
                    document.documentElement.removeEventListener(
                        "mousemove",
                        doDrag,
                        false
                    );
                    document.documentElement.removeEventListener(
                        "mouseup",
                        stopDrag,
                        false
                    );

                    // Save width and height change
                    const pos = getPos();
                    if (pos !== undefined) {
                        editor.view.dispatch(
                            editor.view.state.tr.setNodeMarkup(pos, null, {
                                ...node.attrs,
                                width: window.getComputedStyle(dom).width,
                                height: window.getComputedStyle(dom).height,
                            })
                        );
                    }
                };

                document.documentElement.addEventListener(
                    "mousemove",
                    doDrag,
                    false
                );
                document.documentElement.addEventListener(
                    "mouseup",
                    stopDrag,
                    false
                );
            });

            dom.appendChild(resizeHandle);
            dom.addEventListener("click", handleClick);

            return {
                dom,
                destroy() {
                    dom.removeEventListener("click", handleClick);
                },
            };
        };
    },
});
