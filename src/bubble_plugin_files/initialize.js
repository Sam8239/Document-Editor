function initialize(instance, context) {
    // Set the CSS of the canvas to display as flex
    instance.canvas.css({ display: "flex" });

    // Alias for instance data
    const d = instance.data;

    d.stylesheet = document.createElement("style");
    instance.canvas.append(d.stylesheet);

    // Function to toggle heading level
    const toggleHeading = (level = 0) => {
        executeEditorAction(() => d.documentEditor.toggleHeading(level));
    };

    // Function to toggle paragraph
    const toggleText = () => {
        executeEditorAction(() => d.documentEditor.toggleParagraph());
    };

    // Function to toggle bold formatting
    const toggleBold = () => {
        executeEditorAction(() => d.documentEditor.toggleBold());
    };

    // Function to toggle italic formatting
    const toggleItalic = () => {
        executeEditorAction(() => d.documentEditor.toggleItalic());
    };

    // Function to toggle underline formatting
    const toggleUnderline = () => {
        executeEditorAction(() => d.documentEditor.toggleUnderline());
    };

    // Function to toggle ordered list
    const toggleOrderedList = () => {
        executeEditorAction(() => d.documentEditor.toggleOrderedList());
    };

    // Function to toggle bullet list
    const toggleBulletList = () => {
        executeEditorAction(() => d.documentEditor.toggleBulletList());
    };

    // Function to toggle blockquote
    const toggleBlockquote = () => {
        executeEditorAction(() => d.documentEditor.toggleBlockquote());
    };

    // Function to undo last action
    const undo = () => {
        executeEditorAction(() => d.documentEditor.undo());
    };

    // Function to redo last undone action
    const redo = () => {
        executeEditorAction(() => d.documentEditor.redo());
    };

    // Function to upload an image
    const uploadImage = (uploadUrl) => {
        try {
            d.documentEditor.uploadImage(async (file) => {
                instance.publishState("uploading", true);
                instance.triggerEvent("upload_start");
                const data = await uploadFileToServer(file, uploadUrl);
                const { name, url } = data;
                instance.publishState("uploading", false);
                instance.triggerEvent("upload_finish");
                d.documentEditor.setImage({ url, title: name });
            });
        } catch (error) {
            console.error(error);
            context.reportDebugger(error);
        }
    };

    // Function to set the content of the editor
    const setContent = (content) => {
        executeEditorAction(() => d.documentEditor.setContent(content));
    };

    // Function to clear the content of the editor
    const clearContent = () => {
        executeEditorAction(() => d.documentEditor.clearContent());
    };

    // Function to set text highlight
    const setHighlight = () => {
        executeEditorAction(() => d.documentEditor.setHighlight());
    };

    // Function to remove text highlight
    const unsetHighlight = () => {
        executeEditorAction(() => d.documentEditor.unsetHighlight());
    };

    // Function to set the menu position
    const setMenuPos = (pos) => {
        executeEditorAction(() => d.documentEditor.setMenuPos(pos));
    };

    // Function to replace highlighted text with new text
    const replaceHighlightedText = (newText) => {
        executeEditorAction(() =>
            d.documentEditor.replaceHighlightedText(newText)
        );
    };

    // Function to clear all text highlights in the editor
    const clearHighlight = () => {
        executeEditorAction(() => d.documentEditor.unsetHighlightAll());
    };

    // Function to focus the document editor
    const focus = () => {
        executeEditorAction(() => d.documentEditor.focus());
    };

    // Function to set a link in the editor
    const setLink = (url) => {
        executeEditorAction(() => d.documentEditor.setLink(url));
    };

    // Displays the link popover
    const insertLink = () => {
        executeEditorAction(() => d.documentEditor.insertLink());
    };

    // Hides the link popover
    const hideLinkPopover = () => {
        executeEditorAction(() => d.documentEditor.hideLinkPopover());
    };

    // Function to unset a link in the editor
    const unsetLink = () => {
        executeEditorAction(() => d.documentEditor.unsetLink());
    };

    // Function to set a comment in the editor
    const setComment = (commentId) => {
        executeEditorAction(() => d.documentEditor.setComment(commentId));
    };

    // Function to remove a comment from the editor
    const unsetComment = (commentId) => {
        executeEditorAction(() => d.documentEditor.unsetComment(commentId));
    };

    // Function to focus the active comment in the comments section
    const focusActiveComment = (commentId) => {
        executeEditorAction(() =>
            d.documentEditor.focusActiveComment(commentId)
        );
    };

    // Function to insert placeholder node for uploading images
    const insertImagePlaceholder = () => {
        executeEditorAction(() => d.documentEditor.insertImagePlaceholder());
    };

    // Function to insert content below the current selection
    const insertContentBelowSelection = (content) => {
        executeEditorAction(() =>
            d.documentEditor.insertContentBelowSelection(content)
        );
    };

    // Function to insert content after slash
    const insertContentAfterSlash = (content, insertBelow = false) => {
        executeEditorAction(() =>
            d.documentEditor.insertContentAfterSlash(content, insertBelow)
        );
    };

    // Function to steam content into the editor
    const streamContent = (url) => {
        executeEditorAction(() => d.documentEditor.stream(url));
    };

    // Function to select all text in the editor and apply highlight
    const selectAllAndHighlight = (color) => {
        executeEditorAction(() =>
            d.documentEditor.selectAllAndHighlight(color)
        );
    };

    // Helper function to upload a file to the server
    async function uploadFileToServer(file, uploadUrl, params = {}) {
        try {
            // Create FormData object and append the file to it
            const formData = new FormData();
            formData.append("file", file);

            // Append additional parameters if provided
            if (typeof params === "object" && Object.keys(params).length > 0) {
                for (let key in params) {
                    formData.append(key, params[key]);
                }
            }

            // Send POST request to the server
            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(
                    "Failed to upload file: " + response.statusText
                );
            }

            // Parse response data as JSON
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error("Error uploading file:", error);
            return false; // Return false to indicate failure
        }
    }

    function executeEditorAction(action) {
        try {
            if (typeof action === "function") {
                action();
            }
        } catch (error) {
            console.error(error);
            context.reportDebugger(error);
        }
    }

    function minifyHTML(html) {
        // Remove comments
        html = html.replace(/<!--.*?-->/g, "");

        // Remove whitespace between tags
        html = html.replace(/>\s+</g, "><");

        // Remove unnecessary whitespace
        html = html.replace(/\s{2,}/g, " ");

        // Collapse multiple spaces into one
        html = html.replace(/^\s+|\s+$/g, "");

        return html;
    }

    // Initialize document editor data properties
    d.documentEditor = null;
    d.element = null;
    d.initialContent = null;
    d.uploadUrl = null;
    d.documentOptions = {};
    d.prevInitialContent = "";

    // Assign functions to data properties
    d.toggleHeading = toggleHeading;
    d.toggleBold = toggleBold;
    d.toggleItalic = toggleItalic;
    d.toggleUnderline = toggleUnderline;
    d.toggleOrderedList = toggleOrderedList;
    d.toggleBulletList = toggleBulletList;
    d.toggleBlockquote = toggleBlockquote;
    d.undo = undo;
    d.redo = redo;
    d.uploadImage = uploadImage;
    d.uploadFileToServer = uploadFileToServer;
    d.minifyHTML = minifyHTML;
    d.setContent = setContent;
    d.clearContent = clearContent;
    d.setHighlight = setHighlight;
    d.unsetHighlight = unsetHighlight;
    d.setMenuPos = setMenuPos;
    d.replaceHighlightedText = replaceHighlightedText;
    d.clearHighlight = clearHighlight;
    d.focus = focus;
    d.setComment = setComment;
    d.unsetComment = unsetComment;
    d.focusActiveComment = focusActiveComment;
    d.insertImagePlaceholder = insertImagePlaceholder;
    d.insertContentBelowSelection = insertContentBelowSelection;
    d.setLink = setLink;
    d.unsetLink = unsetLink;
    d.insertLink = insertLink;
    d.hideLinkPopover = hideLinkPopover;
    d.insertContentAfterSlash = insertContentAfterSlash;
    d.selectAllAndHighlight = selectAllAndHighlight;
    d.toggleText = toggleText;
    d.streamContent = streamContent;
}
