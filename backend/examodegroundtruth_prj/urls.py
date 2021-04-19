""" Define URLs pattern for groundtruth_app """
from django.urls import path, include

urlpatterns = [
    path('', include('groundtruth_app.urls')),

]


