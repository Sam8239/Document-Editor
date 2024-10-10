// Importing necessary modules and dependencies
import DocumentEditor from "./components/DocumentEditor";
import { defaultContent } from "./assets/sample-content";

import "./assets/styles/app.demo.css";
import { debounce, generateRandomId, uniqueString } from "./utils";

// Local storage key for saving document content
const localStoreName = "doc-content";

const commentIdPrefix = "_";

// DOM elements and API endpoint
const documentElement = document.querySelector("[data-editor]");
const documentElement2 = document.querySelector("[data-editor-2]");
const fileApiEndpoint = "https://uhhwp1.buildship.run/file-upload";
// const fileApiEndpoint =
//     "https://x9fl-g20m-kela.n7c.xano.io/api:uRKTTqIa:test/upload-image/8e6da0bf-1131-47ac-9bb1-9e092dc28e3d?x-data-source=test";

// Bubble menu elements for AI comment
const bubbleMenuElements = {
    main: document.querySelector('[data-bubble-menu="ai-comment"]'),
    link: document.querySelector('[data-bubble-menu="link-popover"]'),
};

const comments = [
    { id: generateRandomId(8), content: "Great post!" },
    { id: generateRandomId(8), content: "Very informative." },
    { id: generateRandomId(8), content: "Thanks for sharing!" },
    { id: generateRandomId(8), content: "Nice article." },
    { id: generateRandomId(8), content: "Well written." },
];

const collabOptions = {
    // currentUser: "John Smith",
    // collabConfig: {
    //     name: "local-collab-integration",
    //     appId: "09xw72m1",
    //     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjQ3NDkxODgsIm5iZiI6MTcyNDc0OTE4OCwiZXhwIjoxNzI0ODM1NTg4LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiIwOXh3NzJtMSJ9.DrrnaLkIJXnGVDiHUwLyg6pyVczRha2wPJ8LNNXMd4g",
    // },
};

renderComments();

try {
    // Initialize the DocumentEditor with various handlers and configurations
    const documentOptions = {
        placeholderText: "Type “/” for AI commands",
        initialContent: lsGetContent() ?? defaultContent.json, // Load initial content from local storage or default
        updateHandler: (editor) => debounce(lsSaveContent)(editor.getJSON()), // Save content with debounce
        selectionHandler: (selectedText) => {
            if (selectedText) {
                // console.log("selectedText: ", selectedText); // Log selected text
            }
        },
        createHandler: () => {
            console.log(
                "%c DocumentEditor is ready!",
                "background:#ffff10;padding:6px;border-radius:4px;font-weight:600;"
            ); // Log editor readiness
        },
        imageUploadHandler: async (file) => {
            try {
                const data = await uploadFileToServer(file, fileApiEndpoint);
                console.log("image meta: ", data);
                return data;
            } catch (error) {
                console.error(error); // Handle upload errors
            }
        },
        transactionHandler: (editor, tr) => {
            // console.log("editable", editor.isEditable());
            const action = tr.getMeta("action");
            if (action && action.type === "delete") {
                // Handle image removal action
            }

            // console.log(
            //     "is active: paragraph:",
            //     editor.isActive("paragraph")
            // );
            // console.log(
            //     "is active: heading 2:",
            //     editor.isActive("heading", { level: 2 })
            // );
        },
        focusHandler: (editor, event) => {
            // Handle editor focus event
        },
        blurHandler: (editor, event) => {
            // Handle editor blur event
        },
        onUploadStart: () => {
            console.log("Upload started"); // Log upload start
        },
        onUploadFinish: () => {
            console.log("Upload finished"); // Log upload finish
        },
        bubbleMenuElements,
        commentsContainerId: "comments-container",
        slashCommandContainerId: "slash-commands-container",
        slashCommandContainerShown: (instance) => {
            console.log("slash command shown");
        },
        slashCommandContainerHidden: (instance) => {
            console.log("slash command hidden");
        },
        onCommandTrigger: (item, props) => {
            console.log({ item }, { props });
        },
        bubbleMenuShownHandler: (editor) => {
            // console.log("shown"); // Log bubble menu shown

            document
                .querySelector('[data-bubble-menu="ai-comment"]')
                .addEventListener("click", (e) => {
                    const target = e.target;
                    const commentInput = document.querySelector(
                        "[data-comment-input]"
                    );
                    commentInput.removeAttribute("hidden");

                    editor.setHighlight();

                    commentInput.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                            const randomComment =
                                comments[
                                    Math.floor(Math.random() * comments.length)
                                ];
                            editor.setComment(
                                commentIdPrefix + randomComment.id
                            );
                            console.log("set comment ", randomComment.id);
                        }
                    });
                });
        },
        bubbleMenuHiddenHandler: (editor) => {
            // console.log("hidden"); // Log bubble menu hidden

            editor.unsetHighlightAll();
        },
        documentSyncedCallback: (state) => {
            console.log("synced callback", state);
        },
        ...collabOptions,
    };

    let documentEditor = new DocumentEditor(documentElement, documentOptions);
    const documentEditor2 = new DocumentEditor(documentElement2, {
        placeholderText: "Type here...(editor instance 2)",
        onStreamEnd: () => {
            console.log("Streaming completed");
        },
    });

    // Button elements for various editor actions
    const buttons = {
        doc: document.querySelector('[data-tiptap-button="doc"]'),
        speech: document.querySelector('[data-tiptap-button="speech"]'),
        video: document.querySelector('[data-tiptap-button="video"]'),
        headingLevelOne: document.querySelector(
            '[data-tiptap-button="heading-level-1"]'
        ),
        headingLevelTwo: document.querySelector(
            '[data-tiptap-button="heading-level-2"]'
        ),
        headingLevelThree: document.querySelector(
            '[data-tiptap-button="heading-level-3"]'
        ),
        bold: document.querySelector('[data-tiptap-button="bold"]'),
        italic: document.querySelector('[data-tiptap-button="italic"]'),
        underline: document.querySelector('[data-tiptap-button="underline"]'),
        listNumber: document.querySelector(
            '[data-tiptap-button="list-number"]'
        ),
        list: document.querySelector('[data-tiptap-button="list"]'),
        image: document.querySelector('[data-tiptap-button="image"]'),
        undo: document.querySelector('[data-tiptap-button="undo"]'),
        redo: document.querySelector('[data-tiptap-button="redo"]'),
        copy: document.querySelector('[data-tiptap-button="copy"]'),
        share: document.querySelector('[data-tiptap-button="share"]'),
    };

    // Function to set the active state of a button
    const setActiveButton = (button, mark, attributes = {}) => {
        if (documentEditor.isActive(mark, attributes)) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    };

    // Event listeners for button actions
    buttons.doc.addEventListener("click", () => {
        // Testing new methods for documentEditor
        // documentEditor.setMenuPos("bottom");
        // documentEditor.setHighlight();
        // documentEditor.unsetHighlight();
        // documentEditor.unsetHighlightAll();
        // documentEditor.setComment(commentId);
        // documentEditor.unsetComment(commentId);
        // documentEditor.insertPlaceholder();
        // documentEditor.insertContentBelowSelection("Hello");
        // documentEditor.toggleBlockquote();
        // const url = window.prompt("URL", documentEditor.getPreviousURL());
        // documentEditor.insertLink();
        // documentEditor.setLink();
        // documentEditor.setContent(defaultContent.json);
        // documentEditor.replaceHighlightedText("Test text replacement.");
        // documentEditor.insertContentAfterSlash(
        //     "<p>Test text replacement.</p>",
        //     false
        // );
        // documentEditor.selectAllAndHighlight("purple");
        // documentEditor.toggleParagraph();
        // if (documentEditor) {
        //     documentEditor.destroy();
        //     documentEditor = new DocumentEditor(documentElement, {
        //         ...documentOptions,
        //         placeholderText: "A new placeholder",
        //     });
        // }

        const prompt = window.prompt("Give a prompt");
        if (prompt) {
            documentEditor2.stream(
                `https://x9fl-g20m-kela.n7c.xano.io/api:BLeasHpr:test/streaming_output?query=${prompt}`
            );
        }
    });

    buttons.video.addEventListener("click", () => {
        alert("Will be implemented on Bubble"); // Placeholder for video functionality
    });

    buttons.speech.addEventListener("click", () => {
        alert("Will be implemented on Bubble"); // Placeholder for speech functionality
    });

    buttons.headingLevelOne.addEventListener("click", () => {
        documentEditor.toggleHeading(1);
        setActiveButton(buttons.headingLevelOne, "heading", { level: 1 });
    });

    buttons.headingLevelTwo.addEventListener("click", () => {
        documentEditor.toggleHeading(2);
        setActiveButton(buttons.headingLevelTwo, "heading", { level: 2 });
    });

    buttons.headingLevelThree.addEventListener("click", () => {
        documentEditor.toggleHeading(3);
        setActiveButton(buttons.headingLevelThree, "heading", { level: 3 });
    });

    buttons.bold.addEventListener("click", () => {
        documentEditor.toggleBold();
        setActiveButton(buttons.bold, "bold");
    });

    buttons.italic.addEventListener("click", () => {
        documentEditor.toggleItalic();
        setActiveButton(buttons.italic, "italic");
    });

    buttons.underline.addEventListener("click", () => {
        documentEditor.toggleUnderline();
        setActiveButton(buttons.underline, "underline");
    });

    buttons.listNumber.addEventListener("click", () => {
        documentEditor.toggleOrderedList();
        setActiveButton(buttons.listNumber, "orderedList");
    });

    buttons.list.addEventListener("click", () => {
        documentEditor.toggleBulletList();
        setActiveButton(buttons.list, "bulletList");
    });

    buttons.image.addEventListener("click", () => {
        // documentEditor.uploadImage(async (file) => {
        //     try {
        //         // Trigger upload start event
        //         const data = await uploadFileToServer(file, fileApiEndpoint);
        //         console.log("image meta: ", data);
        //         const { name, url } = data;
        //         // Trigger upload finish event
        //         documentEditor.setImage({ url, title: name });
        //     } catch (error) {
        //         console.error(error); // Handle image upload errors
        //     }
        // });

        documentEditor.insertPlaceholder();
    });

    buttons.undo.addEventListener("click", () => {
        if (!documentEditor.canUndo()) return;
        documentEditor.undo(); // Undo last action
    });

    buttons.redo.addEventListener("click", () => {
        if (!documentEditor.canRedo()) return;
        documentEditor.redo(); // Redo last undone action
    });

    buttons.copy.addEventListener("click", () => {
        alert("Will be implemented in Bubble"); // Placeholder for copy functionality
    });

    buttons.share.addEventListener("click", () => {
        alert("Will be implemented in Bubble"); // Placeholder for share functionality
    });
} catch (error) {
    console.error(error); // Handle any initialization errors
}

// Helper function to upload file to server
async function uploadFileToServer(file, uploadUrl, params = {}) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        // Append extra parameters to the form data if provided
        if (typeof params === "object" && Object.keys(params).length) {
            for (let key in params) {
                formData.append(key, params[key]);
            }
        }

        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload file: " + response.statusText);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error uploading file:", error);
        return false; // Return false to indicate failure
    }
}

function renderComments() {
    const commentsContainerEl = document.querySelector("[data-comments]");

    comments.forEach((comment) => {
        const commentDiv = document.createElement("div");
        const commentSpan = document.createElement("span");

        commentDiv.id = commentIdPrefix + comment.id;
        commentDiv.className = "document-comment";
        commentSpan.textContent = comment.content;

        commentDiv.appendChild(commentSpan);
        commentsContainerEl.appendChild(commentDiv);
    });
}

// Function to save content to local storage
function lsSaveContent(content) {
    console.log("Saving content...");
    window.localStorage.setItem(localStoreName, JSON.stringify(content));
    return true;
}

// Function to get content from local storage
function lsGetContent() {
    return window.localStorage.getItem(localStoreName);
}
