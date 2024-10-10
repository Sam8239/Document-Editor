function insert_content_after_slash(instance, properties, context) {
    const { content, insert_below } = properties;
    instance.data.insertContentAfterSlash(content, insert_below);
}
