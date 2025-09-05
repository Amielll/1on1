# ENDPOINTS
BASE="http://localhost:8000"
SIGNUP_URL=$BASE/accounts/api/signup
LOGIN_URL=$BASE/accounts/api/login
CALENDARS_URL=$BASE/calendars
CONTACTS_URL=$BASE/contacts/

# First create some users
http POST $SIGNUP_URL \
    email=amiel@email.com \
    username=amiel \
    password=amiel123 \
    first_name=amiel \
    last_name=nurja

http POST $SIGNUP_URL \
    email=kirsten@email.com \
    username=kirsten \
    password=kirsten123 \
    first_name=kirsten \
    last_name=sutantyo

http POST $SIGNUP_URL \
    email=brian@email.com \
    username=brian \
    password=brian123 \
    first_name=brian \
    last_name=cho



# ===== AMIEL =====
ACCESS_TOKEN=$(http POST $LOGIN_URL username=amiel password=amiel123| grep -o '"access":"[^"]*"' | cut -d '"' -f 4)

# Create calendars
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/ \
    name="Amiel's First Calendar" \
    description="First ever calendar for meeting with others" \
    start_date="2024-05-01" \
    end_date="2024-05-31" \
    duration=30 \
    deadline="2024-04-30T11:59:59Z"
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/ \
    name="Amiel's Second Calendar" \
    description="This calendar isn't finalized yet" \
    start_date="2024-05-01" \
    end_date="2024-05-07" \
    duration=60 \
    deadline="2024-04-30T11:59:59Z" \
    finalized="true"

# Create contacts
http -A bearer -a $ACCESS_TOKEN POST $CONTACTS_URL \
    name="Contact 1" \
    email="contact1@email.com"
http -A bearer -a $ACCESS_TOKEN POST $CONTACTS_URL \
    name="Contact 2" \
    email="contact2@email.com"
http -A bearer -a $ACCESS_TOKEN POST $CONTACTS_URL \
    name="Contact 3" \
    email="contact3@email.com"
http -A bearer -a $ACCESS_TOKEN POST $CONTACTS_URL \
    name="Contact 4" \
    email="contact4@email.com"
http -A bearer -a $ACCESS_TOKEN POST $CONTACTS_URL \
    name="Contact 5" \
    email="contact5@email.com"

# === Calendar 1 (in progress) ===
# Invitees
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/invitees/ \
    contact=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/invitees/ \
    contact=2
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/invitees/ \
    contact=3

# == Preferences ==
# Owner
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=1 \
    start="2024-05-01T08:00:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=1 \
    start="2024-05-01T08:30:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=1 \
    start="2024-05-01T09:00:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=1 \
    start="2024-05-01T09:30:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T10:00:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T10:30:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T11:00:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T11:30:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T12:00:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=3 \
    start="2024-05-01T17:00:00Z" \
    invitee=1
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/1/preferences/ \
    level=3 \
    start="2024-05-01T18:00:00Z" \
    invitee=1

# Invitee 1
http POST $CALENDARS_URL/1/preferences/ \
    level=1 \
    start="2024-05-01T12:00:00Z" \
    invitee=1
http POST $CALENDARS_URL/1/preferences/ \
    level=1 \
    start="2024-05-01T13:00:00Z" \
    invitee=1
http POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T14:00:00Z" \
    invitee=1
http POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T15:00:00Z" \
    invitee=1
http POST $CALENDARS_URL/1/preferences/ \
    level=3 \
    start="2024-05-01T16:00:00Z" \
    invitee=1
http POST $CALENDARS_URL/1/preferences/ \
    level=3 \
    start="2024-05-01T17:00:00Z" \
    invitee=1

# Invitee 2
http POST $CALENDARS_URL/1/preferences/ \
    level=1 \
    start="2024-05-01T12:00:00Z" \
    invitee=2
http POST $CALENDARS_URL/1/preferences/ \
    level=2 \
    start="2024-05-01T13:00:00Z" \
    invitee=2
http POST $CALENDARS_URL/1/preferences/ \
    level=3 \
    start="2024-05-01T13:00:00Z" \
    invitee=2

# Invitee 3
http POST $CALENDARS_URL/1/preferences/ \
    level=3 \
    start="2024-05-01T18:00:00Z" \
    invitee=3


# === Calendar 2 (finalized) ===
# Invitees
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/2/invitees/ \
    contact=4
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/2/invitees/ \
    contact=5

# Events
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/2/events/ \
    name="Meeting with contact 4" \
    description="A random meeting booked for fun." \
    date="2024-05-01" \
    start_time="13:30" \
    attendee=4 \
    last_modified="2024-04-10T12:00:00Z"
http -A bearer -a $ACCESS_TOKEN POST $CALENDARS_URL/2/events/ \
    name="Meeting with contact 5" \
    description="Meeting to discuss life, the universe, and all things worth pondering." \
    date="2024-05-02" \
    start_time="13:30" \
    attendee=5 \
    last_modified="2024-04-10T13:00:00Z"