function should_reinstantiate(instance, properties, context) {
    try {
        if (typeof DocumentEditor === "undefined") {
            throw new Error("DocumentEditor class is not defined.");
        }

        const d = instance.data;

        if (d.documentEditor) {
            d.documentEditor.destroy();

            d.documentEditor = new DocumentEditor(d.element, {
                ...d.documentOptions,
            });
        }
    } catch (error) {
        console.log(error);
        context.reportDebugger(error);
    }
}
