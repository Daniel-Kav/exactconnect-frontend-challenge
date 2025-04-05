
"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from shopper import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/products/', views.product_list, name='product-list'),
    path('api/products/<int:pk>/', views.product_detail, name='product-detail'),
    path('api/categories/', views.product_categories, name='product-categories'),
    path('api/products/category/<str:category>/', views.products_by_category, name='products-by-category'),
    path('api/orders/', views.order_list, name='order-list'),
    path('api/orders/<str:pk>/', views.order_detail, name='order-detail'),
    path('api/orders/<str:pk>/cancel/', views.cancel_order, name='cancel-order'),
]
