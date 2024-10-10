function unset_comment(instance, properties, context) {
    const { comment_id } = properties;
    instance.data.unsetComment(comment_id);
}
