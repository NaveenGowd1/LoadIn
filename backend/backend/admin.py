from django.contrib import admin
from drivers.models import DriverProfile
from loads.models import Load

admin.site.register(DriverProfile)
admin.site.register(Load)