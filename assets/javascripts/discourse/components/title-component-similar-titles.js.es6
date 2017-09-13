import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({
  @computed()
  updateTips() {
    return (result) => {
      if (result.filter(t => t.identical).length > 0) {
        return this.sendAction('updateTip', 'composer.tip.identical_title', 'top');
      }

      if (result.length < 1) {
        this.sendAction('updateTip', '', 'top');
        this.sendAction('updateTip', 'composer.tip.no_similar_titles', 'bottom');
      } else if (result.length === 1) {
        this.sendAction('updateTip', 'composer.tip.similar_titles_top_singular', 'top');
        this.sendAction('updateTip', 'composer.tip.similar_titles_bottom_singular', 'bottom');
      } else {
        this.sendAction('updateTip', 'composer.tip.similar_titles_top_plural', 'top');
        this.sendAction('updateTip', 'composer.tip.similar_titles_bottom_plural', 'bottom');
      }

      this.sendAction('ready');
    }
  }
})
