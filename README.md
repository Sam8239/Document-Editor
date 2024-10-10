# Document Editor

The Document Editor is a robust, customizable rich text editor built on the Tiptap framework. It leverages various Tiptap extensions to provide a comprehensive editing experience.

## DocumentEditor Class

The `DocumentEditor` class is where it all begins. It initializes and manages the Tiptap-based rich text editor, incorporating various extensions to enhance functionality.

## Usage

To use the `DocumentEditor`, instantiate it with a target HTML element and optional configuration options:

```javascript
import DocumentEditor from "./DocumentEditor";

const editor = new DocumentEditor(document.getElementById("editor"), {
    initialContent: "<p>Hello, World!</p>",
    editable: true,
    autofocus: true,
    characterLimit: 1000,
    updateHandler: (editorInstance) => {
        console.log("Content updated");
    },
    imageUploadHandler: (file) => {
        return new Promise((resolve) => {
            // Upload logic
            const data = {
                name: file.name,
                url: "uploaded-image-url", // Replace with actual upload URL logic
            };
            resolve(data);
        });
    },
});
```

## Dependencies

To install the required dependencies, use `yarn`:

```bash
yarn
```

## Development

To run the development server:

```bash
yarn dev
```

## Production

To build the project for production:

```bash
yarn build
```

## Features

-   Fully customizable and extensible
-   Built on the powerful Tiptap framework
-   Headless design for custom menu integration
-   Rich text editing capabilities
-   Image upload support
-   Commenting functionality
-   Undo/Redo support
-   Highlighting features
-   Live selection highlighting
-   Drag-and-drop or paste images

## Configuration Options

When creating an instance of the `DocumentEditor`, you can provide various configuration options:

-   **initialContent:** The initial content to load into the editor (default: empty string).
-   **editable:** Set the editor to be editable or read-only (default: true).
-   **autofocus:** Automatically focus the editor on load (default: false).
-   **characterLimit:** Set a character limit for the editor content (default: no limit).
-   **updateHandler:** A callback function triggered on content updates.
-   **imageUploadHandler:** A function to handle image uploads, returning a promise that resolves with the image data in the format `{ name: "", url: "" }`.

## Upload URL Expected JSON Format

The upload URL should handle file uploads (buffer) and expects the JSON response in the following format:

```json
{
    "name": "",
    "url": ""
}
```

Here's an example of the code that handles the upload:

```javascript
const data = {
    name: ctx["root"]["ad9367eb-b15b-4944-86a5-5322bdea912f"],
    url: ctx["root"]["55185c49-f10f-414a-981b-34b25677ae3c"]["downloadURL"],
};

return data;
```

## Support

For support, please contact us at hello@nerdheadz.com.
