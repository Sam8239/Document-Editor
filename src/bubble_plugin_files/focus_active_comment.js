function focus_active_comment(instance, properties, context) {
    const { comment_id } = properties;
    instance.data.focusActiveComment(comment_id);
}
