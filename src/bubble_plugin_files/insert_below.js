function insert_below(instance, properties, context) {
    const { content } = properties;
    instance.data.insertContentBelowSelection(content);
}
