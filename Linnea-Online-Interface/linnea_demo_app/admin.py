from django.contrib import admin
from import_export.admin import ExportActionMixin 
from linnea_demo_app.models import Post,SResult, FResult 

# Register your models here.

# Super User Credentials
# admin
# admin@admin.com
# adminadmin

@admin.register(SResult)
class ViewAdmin(ExportActionMixin, admin.ModelAdmin):
    pass

@admin.register(FResult)
class ViewAdmin(ExportActionMixin, admin.ModelAdmin):
    pass