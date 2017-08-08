import { default as computed } from 'ember-addons/ember-computed-decorators';
import { getOwner } from 'discourse-common/lib/get-owner';

export default Ember.Component.extend({
  classNameBindings: [':title-composer', 'showLength:show-length'],
  showGutter: Ember.computed.or('bottomTip', 'showNext'),
  placeholder: I18n.t('composer.title_or_link_placeholder'),
  component: null,
  showLength: false,
  showBack: Ember.computed.gt('step', 0),
  step: null,
  composerProperties: {},

  init() {
    this._super(...arguments);
    this.setProperties({
      'components': this.siteSettings.composer_title_components.split('|'),
      'conditionalComponents': this.siteSettings.composer_title_conditional_components.split('|')
    })
  },

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
      if (this._state == 'destroying') return;

      this.hideTitleTips();
    }
  },

  showTitleTips() {
    let props = {
      'showLength': true,
      'bottomTip': 'composer.tip.title',
      'showNext': true
    }

    if (this.get('components').length > 0) {
      Object.assign(props, {
        'componentReady': true,
      })
    }

    this.setProperties(props);
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

  @computed('titleValid')
  titleLengthClass(valid) {
    return valid ? '' : 'invalid'
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
      addProperties: addProperties
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
      'topTip': '',
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
      if (this.get('isConditionalStep')) {
        this.set('isConditionalStep', false);
      } else {
        if (step === null || step === 0) return;
        step--;
      }

      const components = this.get('components');
      this.setProperties({
        'component': components[step],
        'step': step,
        'nextTarget': null
      })
    },

    next() {
      if (this.get('nextDisabled')) return;
      this.resetDisplay();

      const conditional = this.get('conditionalComponents');
      const targetStep = conditional.indexOf(this.get('nextTarget'));
      if (targetStep > -1) {
        this.setProperties({
          'component': conditional[targetStep],
          'nextTarget': null,
          'isConditionalStep': true
        })
        return;
      }

      const components = this.get('components');
      let step = this.get('step');
      if (step === (components.length - 1)) {
        return this.openComposer();
      } else if (step == null) {
        step = 0;
      } else {
        step++;
      }

      const component = getOwner(this).lookup(`component:${components[step]}`);
      if (!component) {
        return this.openComposer();
      }

      this.setProperties({
        'component': components[step],
        'step': step,
        'nextTarget': null
      })
    }
  }
})
