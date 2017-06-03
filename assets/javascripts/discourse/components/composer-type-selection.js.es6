import { default as computed } from 'ember-addons/ember-computed-decorators';
import { getOwner } from 'discourse-common/lib/get-owner';

export default Ember.Component.extend({
  classNameBindings: [':composer-component', ':topic-type-container', 'isTitleComposer:show-descriptions' ],
  currentType: '',

  didInsertElement() {
    this.sendAction('updateTip', 'composer.tip.type_choice', 'top');
  },

  @computed()
  topicTypes() {
    return this.siteSettings.composer_topic_types.split('|');
  },

  actions: {
    switchTopicType(type) {
      this.set('currentType', type);
      this.sendAction('addComposerProperty', 'currentType', type)
      if (type === 'event') {
        this.sendAction('setNextTarget', 'composer-add-event');
      }
      this.sendAction('ready');
    }
  }
})
