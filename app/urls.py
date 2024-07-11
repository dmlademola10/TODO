from django.urls import path

from app import views

urlpatterns = [
    path('', views.index, name="index"),
    path('save', views.save),
    path('modify', views.modify),
    path('refresh', views.refresh),
    path('delete', views.delete),
]
