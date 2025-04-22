from django.urls import path
from .views import FileCreateView, FileListView, FileDetailView

urlpatterns = [
    path('files/upload/', FileCreateView.as_view(), name='file-upload'),
    path('files/', FileListView.as_view(), name='file-list'),
    path('files/<uuid:pk>/', FileDetailView.as_view(), name='file-detail'),
]
