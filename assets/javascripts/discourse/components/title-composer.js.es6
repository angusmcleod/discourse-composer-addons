import { default as computed } from 'ember-addons/ember-computed-decorators';
import { getOwner } from 'discourse-common/lib/get-owner';

export default Ember.Component.extend({
  classNameBindings: [':title-composer', 'showLength:show-length'],
  showGutter: Ember.computed.or('bottomTip', 'showNext'),
  component: null,
  showLength: false,
  showBack: Ember.computed.gt('step', 0),
  step: null,
  composerProperties: {},

  didInsertElement() {
    Ember.$(document).on('click', Ember.run.bind(this, this.documentClick))
  },

  willDestroyElement() {
    Ember.$(document).off('click', Ember.run.bind(this, this.documentClick))
  },

  documentClick(e) {
    let $element = this.$();
    let $target = $(e.target);
    if (!$target.closest($element).length) {
      this.clickOutside();
    }
  },

  click() {
    if (!this.get('component')) {
      this.showTitleTips();
    }
  },

  clickOutside() {
    if (!this.get('component')) {
      this.hideTitleTips();
    }
  },

  showTitleTips() {
    this.setProperties({
      'showLength': true,
      'showNext': true,
      'componentReady': true,
      'bottomTip': 'composer.tip.title',
    })
  },

  hideTitleTips() {
    this.setProperties({
      'showLength': false,
      'showNext': false,
      'componentReady': false,
      'topTip': null,
      'bottomTip': null
    })
  },

  @computed('title')
  titleLength(title) {
    return title ? title.length : 0;
  },

  @computed('titleLength')
  titleValid(titleLength) {
    const min = this.siteSettings.min_topic_title_length;
    const max = this.siteSettings.max_topic_title_length;
    return titleLength >= min && titleLength <= max;
  },

  @computed('titleValid', 'componentReady')
  nextDisabled(titleValid, componentReady) {
    return !titleValid || !componentReady;
  },

  keyDown(e) {
    if (e.keyCode === 13) this.send('next');
  },

  openComposer() {
    const controller = getOwner(this).lookup('controller:composer');
    let addProperties = this.get('composerProperties');
    addProperties['title'] = this.get('title');

    controller.open({
      categoryId: this.get('category.id'),
      action: 'createTopic',
      draftKey: 'new_topic',
      draftSequence: 0,
      addProperties: this.get('composerProperties')
    });

    this.resetProperties();
  },

  resetProperties() {
    this.setProperties({
      component: null,
      showLength: false,
      showNext: false,
      step: null,
      title: ''
    });
  },

  resetDisplay() {
    this.setProperties({
      'componentReady': false,
      'bottomTip': '',
      'topTip': ''
    })
  },

  updateStep(step) {
    const components = this.siteSettings.composer_title_components.split('|');
    this.setProperties({
      'component': components[step],
      'step': step,
      'nextTarget': null
    })
  },

  actions: {
    setNextTarget(target) {
      this.set('nextTarget', target);
    },

    addComposerProperty(key, value) {
      let props = this.get('composerProperties');
      props[key] = value;
      this.set("composerProperties", props);
    },

    updateTip(tip, location) {
      this.set(`${location}Tip`, tip);
    },

    ready() {
      this.set('componentReady', true);
    },

    back() {
      this.resetDisplay();

      let step = this.get('step');
      if (step === null || step === 0) return;
      step--;

      this.updateStep(step)
    },

    next() {
      if (this.get('nextDisabled')) return;
      this.resetDisplay();

      const components = this.siteSettings.composer_title_components.split('|');
      const targetStep = components.indexOf(this.get('nextTarget'));
      if (targetStep > -1) {
        this.updateStep(targetStep);
        return;
      }

      let step = this.get('step');
      if (step === (components.length - 1)) {
        return this.openComposer();
      } else if (step == null) {
        step = 0;
      } else {
        step++;
      }

      this.updateStep(step);
    }
  }
})
