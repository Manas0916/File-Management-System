from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .models import UserFile, StoredFile
from .serializers import UserFileSerializer
import hashlib
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserFileFilter

class FileCreateView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        file_bytes = file.read()
        file_hash = hashlib.sha256(file_bytes).hexdigest()
        file.seek(0)

        stored_file, _ = StoredFile.objects.get_or_create(
            file_hash=file_hash,
            defaults={
                'file': file,
                'size': file.size
            }
        )
        user_file_object = UserFile.objects.create(
            stored_file=stored_file,
            original_filename=file.name,
            file_type=file.content_type,
        )
        serializer = UserFileSerializer(user_file_object, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FileListView(ListAPIView):
    queryset = UserFile.objects.select_related('stored_file').all()
    serializer_class = UserFileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFileFilter

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # Add size to each file in the response
        return response

class FileDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            file = UserFile.objects.get(pk=pk)
        except UserFile.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserFileSerializer(file, context={'request': request})
        data = serializer.data
        data['size'] = file.stored_file.size
        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, pk, *args, **kwargs):
        try:
            file = UserFile.objects.get(pk=pk)
        except UserFile.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

        file.delete()
        return Response({'message': 'File deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
