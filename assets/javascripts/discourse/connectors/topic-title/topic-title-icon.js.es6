import { topicIconClass } from '../../lib/composer-utilities';

export default {
  setupComponent(args, component) {
    component.set('topicIcon', topicIconClass(args.model.get('subtype')))
  }
}
