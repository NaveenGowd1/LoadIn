from django.urls import path

from .views import AcceptLoadAPIView, CancelLoadAPIView, CreateLoadAPIView, AvailableLoadsAPIView, DeliverLoadAPIView, LoadDetailAPIView, LoadHistoryAPIView, MyLoadsAPIView, MyAcceptedLoadsAPIView, StartLoadAPIView


urlpatterns = [

    path(
        "create/",
        CreateLoadAPIView.as_view(),
        name="create-load",
    ),
    
    path(
        "list/",
        AvailableLoadsAPIView.as_view(),
        name="list-loads",
    ),
    path(
        "<int:pk>/accept/",
        AcceptLoadAPIView.as_view(),
        name="accept-load",
    ),
    
    path(
        "my-loads/",
        MyLoadsAPIView.as_view(),
        name="my-loads",
    ),
    
    path(
        "my-accepted-loads/",
        MyAcceptedLoadsAPIView.as_view(),
        name="my-accepted-loads",
    ),
    
    path(
        "<int:pk>/",
        LoadDetailAPIView.as_view(),
        name="load-detail",
    ),
    
    path(
        "<int:pk>/start/",
        StartLoadAPIView.as_view(),
        name="start-load",
    ),
    
    path(
        "<int:pk>/deliver/",
        DeliverLoadAPIView.as_view(),
        name="deliver-load",
    ),
    
    path(
        "<int:pk>/cancel/",
        CancelLoadAPIView.as_view(),
        name="cancel-load",
    ),
    path(
        "<int:pk>/history/",
        LoadHistoryAPIView.as_view(),
        name="load-history",
    ),
]