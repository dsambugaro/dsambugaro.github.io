from django.shortcuts import render
from posts.models import Post

def index(request):
    return render(request, 'index.html', {"posts" : Post.objects.all()})

def post(request, post_id):
    post = Post.objects.get(id=post_id)
    return render(request, 'post.html', {"post" : post})
