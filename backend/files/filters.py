from django_filters import rest_framework as filters
from .models import UserFile

class UserFileFilter(filters.FilterSet):
    start_date = filters.DateTimeFilter(field_name="uploaded_at", lookup_expr="gte")
    end_date = filters.DateTimeFilter(field_name="uploaded_at", lookup_expr="lte")
    file_size = filters.CharFilter(field_name="stored_file__size", method='filter_by_file_size')
    file_name = filters.CharFilter(field_name="original_filename", lookup_expr="icontains")
    file_type = filters.CharFilter(field_name="file_type", method='filter_by_file_type')
    
    class Meta:
        model = UserFile
        fields = ['file_type', 'start_date', 'end_date', 'file_size', 'file_name']
        
        
    def filter_by_file_size(self, queryset, name, value):
        if value == 'small':
            return queryset.filter(stored_file__size__lte=131072)
        elif value == 'medium':
            return queryset.filter(stored_file__size__lte=1310720).filter(stored_file__size__gt=131072)
        elif value == 'large':
            return queryset.filter(stored_file__size__gt=1048576)
        return queryset
    
    def filter_by_file_type(self, queryset, name, value):
        print(f"Filtering by file type: {value}")
        if value == 'img':
            return queryset.filter(file_type__startswith='image/')
        elif value == 'video':
            return queryset.filter(file_type__startswith='video/')
        elif value == 'audio':
            return queryset.filter(file_type__startswith='audio/')
        elif value == 'file':
            return queryset.exclude(file_type__startswith='image/').exclude(file_type__startswith='video/').exclude(file_type__startswith='audio/')
        return queryset
