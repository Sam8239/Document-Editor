function set_comment(instance, properties, context) {
    const { comment_id } = properties;
    instance.data.setComment(comment_id);
}
