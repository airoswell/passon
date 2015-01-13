from app.models import Post
from haystack import indexes


class PostIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(document=True, use_template=True)
    # these fields are used to narrow down data
    title = indexes.CharField(model_attr='title')
    detail = indexes.CharField(model_attr='detail')
    area = indexes.CharField(model_attr='area')
    time_posted = indexes.DateTimeField(model_attr="time_posted")
    tags = indexes.CharField(model_attr="tags")

    def get_model(self):
        return Post

    def index_queryset(self, using=None):
        return self.get_model().objects.all()
