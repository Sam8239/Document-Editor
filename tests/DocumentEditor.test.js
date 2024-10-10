import DocumentEditor from "../src/components/DocumentEditor";

describe("DocumentEditor", () => {
    let editor;

    beforeEach(() => {
        const element = document.createElement("div");
        document.body.appendChild(element); // Append to body to simulate a DOM environment
        editor = new DocumentEditor(element, {});
    });

    describe("setContent", () => {
        test("should set valid HTML content", () => {
            const validHTML = "<p>Hello World</p>";
            editor.setContent(validHTML);
            expect(editor.getHTML()).toContain("Hello World");
        });
    });
});
