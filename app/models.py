from django.db import models

# Create your models here.
class Task(models.Model):
    label = models.CharField(verbose_name="Task Label", max_length=100)
    done = models.BooleanField(default=False)
    time_added= models.DateTimeField(auto_now_add=True)
