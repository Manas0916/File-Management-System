from .models import UserFile
from rest_framework import serializers

class UserFileSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    file_url = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = UserFile
        fields = ['id', 'file', 'original_filename', 'file_type', 'uploaded_at', 'file_url', 'size']

    def get_file_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.stored_file.file.url) if request else obj.stored_file.file.url
    
    def get_size(self, obj):
        return obj.stored_file.size

    def create(self, validated_data):
        uploaded_file = validated_data.pop('file')
        
