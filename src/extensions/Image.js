import Image from "@tiptap/extension-image";
import { Plugin } from "prosemirror-state";
import { uniqueString } from "../utils";
import { DeleteIcon } from "../assets/icons";

// Extend the Image extension
export default Image.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            uploadCallback: () => Promise.resolve({ name: "", url: "" }),
        };
    },
    // Add ProseMirror plugins for handling events
    addProseMirrorPlugins() {
        const {
            options: { uploadCallback },
        } = this;

        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        // Handle drop events for images
                        drop(view, event) {
                            // Check if files were dropped
                            const hasFiles =
                                event.dataTransfer &&
                                event.dataTransfer.files &&
                                event.dataTransfer.files.length;

                            if (!hasFiles) {
                                return;
                            }

                            // Filter out only image files
                            const images = Array.from(
                                event.dataTransfer.files
                            ).filter((file) => /image/i.test(file.type));

                            if (images.length === 0) {
                                return;
                            }

                            event.preventDefault();

                            const { schema } = view.state;
                            const coordinates = view.posAtCoords({
                                left: event.clientX,
                                top: event.clientY,
                            });

                            // Read each dropped image file and insert into the editor
                            images.forEach((image) => {
                                const reader = new FileReader();

                                reader.onload = (readerEvent) => {
                                    const tempNode = schema.nodes.image.create({
                                        src: readerEvent.target.result,
                                    });
                                    insertImageNode(tempNode);

                                    uploadCallback(image)
                                        .then((data = {}) => {
                                            const { name, url } = data;

                                            if (name || url) {
                                                const finalNode =
                                                    schema.nodes.image.create({
                                                        src: url,
                                                        title: name,
                                                    });
                                                removeTempImageNode(
                                                    readerEvent.target.result,
                                                    () => {
                                                        insertImageNode(
                                                            finalNode
                                                        );
                                                    }
                                                );
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error uploading image:",
                                                error
                                            );
                                        });

                                    function insertImageNode(node) {
                                        const insertTransaction =
                                            view.state.tr.insert(
                                                coordinates.pos,
                                                node
                                            );
                                        view.dispatch(insertTransaction);
                                    }

                                    function removeTempImageNode(tempSrc, cb) {
                                        const { tr } = view.state;
                                        const nodePos = tr.mapping.map(
                                            coordinates.pos
                                        );
                                        const node = tr.doc.nodeAt(nodePos);
                                        if (
                                            node &&
                                            node.type.name === "image" &&
                                            node.attrs.src === tempSrc
                                        ) {
                                            const removeTransaction =
                                                view.state.tr.delete(
                                                    nodePos,
                                                    nodePos + node.nodeSize
                                                );
                                            view.dispatch(removeTransaction);

                                            if (typeof cb === "function") {
                                                cb();
                                            }
                                        }
                                    }
                                };

                                reader.readAsDataURL(image);
                            });
                        },

                        // Handle paste events for images
                        paste(view, event) {
                            const hasFiles =
                                event.clipboardData &&
                                event.clipboardData.files &&
                                event.clipboardData.files.length;

                            if (!hasFiles) {
                                return;
                            }

                            const images = Array.from(
                                event.clipboardData.files
                            ).filter((file) => /image/i.test(file.type));

                            if (images.length === 0) {
                                return;
                            }

                            event.preventDefault();

                            const { schema } = view.state;

                            // Read each pasted image file and replace the selection with it
                            images.forEach((image) => {
                                const reader = new FileReader();

                                reader.onload = (readerEvent) => {
                                    const tempNode = schema.nodes.image.create({
                                        src: readerEvent.target.result,
                                    });
                                    replaceSelectionWithImageNode(tempNode);

                                    uploadCallback(image)
                                        .then((data = {}) => {
                                            const { name, url } = data;

                                            if (name || url) {
                                                const finalNode =
                                                    schema.nodes.image.create({
                                                        src: url,
                                                        title: name,
                                                    });
                                                removeTempImageNode(
                                                    readerEvent.target.result,
                                                    () => {
                                                        replaceSelectionWithImageNode(
                                                            finalNode
                                                        );
                                                    }
                                                );
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error uploading image:",
                                                error
                                            );
                                        });

                                    function replaceSelectionWithImageNode(
                                        node
                                    ) {
                                        const transaction =
                                            view.state.tr.replaceSelectionWith(
                                                node
                                            );
                                        view.dispatch(transaction);
                                    }

                                    function removeTempImageNode(tempSrc, cb) {
                                        const { tr } = view.state;
                                        const nodePos = tr.mapping.map(
                                            view.state.selection.from
                                        );
                                        const node = tr.doc.nodeAt(nodePos);
                                        if (
                                            node &&
                                            node.type.name === "image" &&
                                            node.attrs.src === tempSrc
                                        ) {
                                            const removeTransaction =
                                                view.state.tr.delete(
                                                    nodePos,
                                                    nodePos + node.nodeSize
                                                );
                                            view.dispatch(removeTransaction);

                                            if (typeof cb === "function") {
                                                cb();
                                            }
                                        }
                                    }
                                };

                                reader.readAsDataURL(image);
                            });
                        },
                    },
                },
            }),
        ];
    },
    // Add attributes for the image node
    addAttributes() {
        return {
            src: {
                default: "",
            },
            alt: {
                default: "",
            },
            title: {
                default: "",
            },
            style: {
                default: "width: 100%; height: auto;",
            },
        };
    }, // Customize the view for the image node
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const {
                view,
                options: { editable, element: documentElement },
            } = editor;
            const { src, alt, style } = node.attrs;
            const container = document.createElement("div");
            const img = document.createElement("img");
            const button = document.createElement("button");

            container.classList.add("image-wrapper");
            container.style.width = img.style.width;

            img.setAttribute("src", src);
            img.setAttribute("alt", alt);
            img.setAttribute("style", style);
            img.setAttribute("draggable", true);

            container.appendChild(img);

            // If editor is not editable, return the image DOM element
            if (!editable) return { dom: img };

            button.classList.add("image-delete-button");
            const pathId = uniqueString();
            button.innerHTML = DeleteIcon(pathId);
            button.firstElementChild.style.pointerEvents = "none";
            Object.assign(button.style, {
                display: "none",
                width: "32px",
                height: "32px",
                position: "absolute",
                padding: "6px",
                top: 0,
                right: 0,
                border: "none",
                borderRadius: "4px",
                background: "#F8F4F1",
                cursor: "pointer",
            });

            container.appendChild(button);

            // Handle document click events to hide delete button
            documentElement.addEventListener(
                "click",
                (e) => {
                    const target = e.currentTarget;
                    if (target !== container) {
                        container.style.outline = "";
                        button.style.display = "none";
                    }
                },
                true
            );

            container.addEventListener(
                "click",
                (e) => {
                    // Show delete button and highlight image container on click
                    const { borderRadius, height } =
                        window.getComputedStyle(img);
                    const styles = [
                        "position:relative",
                        "outline: 2px solid #1974E8",
                        `border-radius: ${borderRadius}`,
                        `height: ${height}`,
                        "padding:0",
                        "box-sizing: border-box",
                        "cursor: move",
                    ];
                    container.setAttribute(
                        "style",
                        styles.join(";") + ";" + style
                    );
                    button.style.display = "";

                    // Handle delete button click
                    if (e.target === button) {
                        // Create a transaction with metadata specifying the deletion action
                        const tr = view.state.tr.setMeta("action", {
                            type: "delete",
                            item: "image",
                            src: img.src,
                        });

                        // Remove the image container from the editor
                        container.remove();
                        view.dispatch(tr);
                    }
                },
                true
            );

            // Return the container DOM element for the image
            return { dom: container };
        };
    },
});
