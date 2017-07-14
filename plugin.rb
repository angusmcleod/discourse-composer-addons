# name: discourse-composer-addons
# about: Additional functionality for the Discourse composer
# version: 0.1
# authors: Angus McLeod
# url: https://github.com/angusmcleod/discourse-composer-addons

register_asset 'stylesheets/composer-addons.scss'

after_initialize do
  SiteSetting.class_eval do
    @choices[:composer_title_components].push('composer-type-selection')
  end

  require_dependency 'topic_subtype'
  class ::TopicSubtype
    def initialize(id, options)
      super
      SiteSetting.topic_types.each do |type|
        define_method "self.#{type}" do
          type
        end
        register type
      end
    end
  end

  require_dependency 'topic_view_serializer'
  class ::TopicViewSerializer
    attributes_from_topic :subtype
  end

  PostRevisor.track_topic_field(:topic_type)
  PostRevisor.track_topic_field(:make_wiki)
  PostRevisor.track_topic_field(:skip_validations)

  DiscourseEvent.on(:post_created) do |post, opts, user|
    topic_type = opts[:topic_type]
    make_wiki = opts[:make_wiki]
    if post.is_first_post? and topic_type
      topic = Topic.find(post.topic_id)
      if make_wiki.to_s == "true"
        post.wiki = true
        post.save!
      end
      topic.subtype = topic_type
      topic.save!
    end
  end

  add_to_serializer(:basic_category, :show_title_composer) {
    scope && scope.current_user.present? && object.permission == CategoryGroup.permission_types[:full]
  }
end
