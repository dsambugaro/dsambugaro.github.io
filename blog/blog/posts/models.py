from django.db import models

class Post(models.Model):

    titulo = models.CharField(max_length = 255, null = False)
    autor = models.CharField(max_length = 255, null = False)
    data = models.DateField(null = False)
    conteudo = models.TextField(null = False)
