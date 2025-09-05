from django.urls import path
from .views.calendar_viewset import CalendarViewSet
from .views.event_viewset import EventViewSet
from rest_framework.routers import DefaultRouter
from .views.invitee_viewset import InviteeViewSet
from .views.contact_viewset import ContactViewSet
from .views.preference_viewset import PreferenceViewSet
from .views.schedule_view import ScheduleView

router = DefaultRouter()
router.register(r'calendars', CalendarViewSet, basename='calendar')
router.register(
    r'calendars/(?P<calendar_pk>\d+)/events',
    EventViewSet,
    basename='events'
)
router.register(
    r'calendars/(?P<calendar_pk>\d+)/invitees', 
    InviteeViewSet, 
    basename='invitees'
)
router.register(
    r'calendars/(?P<calendar_pk>\d+)/preferences',
    PreferenceViewSet,
    basename='preferences'
)

router.register(r'contacts', ContactViewSet, basename='contact')

urlpatterns = router.urls + [
    path('calendars/<int:calendar_id>/schedule/', ScheduleView.as_view(), name='schedule')
]
