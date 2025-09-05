from datetime import time, datetime, timedelta
from django.http import HttpResponse, JsonResponse
from rest_framework.generics import get_object_or_404
from rest_framework.views import View

from ..serializers.calendar_serializer import CalendarSerializer
from ..models.calendar import Calendar
from ..models.preference import Preference
from ..models.invitee import Invitee
from ..permissions.calendar_permission import CalendarPermission


class ScheduleView(View):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [CalendarPermission]

    def get(self, request, calendar_id):
        calendar = get_object_or_404(Calendar, pk=calendar_id)
        return JsonResponse(get_suggested_schedule(calendar), safe=False)


def get_suggested_schedule(calendar: Calendar):
    """ Create a suggested schedule for a given calendar.

    This function takes a greedy approach for creating a schedule. For each user, it tries
    to schedule their most preferable time if not already taken, otherwise it tries to find
    some arbitrary available time.

    Args:
        calendar (Calendar): The calendar to create a schedule for

    Returns:
        A list containing:
            - The user ID
            - The day and start time of the scheduled event
    """

    all_preferences = list(Preference.objects.filter(calendar_id=calendar.id))
    all_invitees = list(Invitee.objects.filter(calendar_id=calendar.id))
    duration = calendar.duration
    schedule = []

    # Initialize map for invitee id -> preference
    invitee_preferences = {}
    owner_preferences = []
    for invitee in all_invitees:
        invitee_preferences[invitee.id] = []

    for preference in all_preferences:
        if preference.invitee:
            invitee_preferences[preference.invitee.id].append(preference)
        else:
            # Owner's preference
            owner_preferences.append(preference)

    # Create event for each invitee
    for invitee_id in invitee_preferences.keys():
        scheduled = False

        # Try to slot each preference starting with the most preferable
        curr_preferences = sorted(invitee_preferences[invitee_id], key=lambda pref: pref.level, reverse=True)
        for preference in curr_preferences:
            pref_date = preference.start.date()
            pref_time = preference.start.time()
            pref_datetime = datetime.combine(pref_date, pref_time)

            # This preference is valid if there aren't any overlapping events scheduled already
            is_valid = not any(
                event["date"] == pref_date and
                event["start_time"] <= pref_datetime.time() <
                (datetime.combine(pref_date, event["start_time"]) + timedelta(minutes=duration)).time()
                for event in schedule
            ) and any(pref.start.date() == pref_datetime.date() and pref.start.time() == pref_datetime.time() for pref in owner_preferences)

            # Found a valid timeslot, schedule the event with the current invitee
            if is_valid:
                # Remove the owner preference from future consideration
                for i in range(len(owner_preferences)):
                    owner_pref = owner_preferences[i]
                    if owner_pref.start.time() == pref_time:
                        del owner_preferences[i]
                        break

                schedule.append({
                    "invitee_id": invitee_id,
                    "date": pref_date,
                    "start_time": pref_time
                })
                scheduled = True
                break  # No need to try their other preferences now

        if not scheduled and len(owner_preferences) > 0:
            # If none of the invitee's preference could be met, book a time at the owner's first
            # available request
            owner_pref = owner_preferences[0]
            schedule.append({
                "invitee_id": invitee_id,
                "date": owner_pref.start.date(),
                "start_time": owner_pref.start.time()
            })
            scheduled = True
            del owner_preferences[0]

        if not scheduled:
            # If no preferences could be accommodated, find any available time in the schedule
            # This will try every duration block within a given day, then move to the next day
            start_date = calendar.start_date
            end_date = calendar.end_date
            current_date = start_date

            while current_date <= end_date:
                # Iterate through each time block within the day
                current_time = datetime.combine(current_date, time(hour=0, minute=0))  # Start from midnight
                end_time = datetime.combine(current_date, time(hour=23, minute=59))  # End at 11:59 PM
                while current_time + timedelta(minutes=duration) <= end_time:
                    # Check if there's no event scheduled for this time block
                    if not any(event["date"] == current_date and
                               event["start_time"] == current_time.time() for event in schedule):
                        # If the slot is available, schedule the event
                        schedule.append({
                            "invitee_id": invitee_id,
                            "date": current_date,
                            "start_time": current_time.time()
                        })
                        scheduled = True
                        break  # No need to check further within this day
                    current_time += timedelta(minutes=duration)  # Move to the next time block

                if scheduled:
                    break  # No need to proceed to the next day since an event is scheduled
                current_date += timedelta(days=1)  # Move to the next day

            if not scheduled:
                print(f'Could not schedule meeting with Invitee: {invitee_id}')

    return schedule
