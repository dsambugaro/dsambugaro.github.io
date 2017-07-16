from django.conf.urls import url

from posts import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^posts/(?P<post_id>\w+)$', views.post, name='post'),
]
