export default {
  setupComponent(attrs, component) {
    component.set('topicTypes', Discourse.SiteSettings.composer_topic_types.split('|'))
  }
}
